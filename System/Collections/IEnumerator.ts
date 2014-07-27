/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


module System.Collections {

	"use strict";

	export interface IEnumerator<T> {
		current: T;
		moveNext(): boolean;
		reset(): void;
		dispose(): void;
	}

	export interface IYield<T> {
		current: T;
		yieldReturn(value: T): boolean;
		yieldBreak(): boolean;
	}

	class Yielder<T> implements IYield<T>
	{
		private _current: T;
		get current(): T { return this._current; }

		yieldReturn(value:T): boolean {
			this._current = value;
			return true;
		}

		yieldBreak(): boolean {
			this._current = null;
			return false;
		}
	}

	// IEnumerator State
	enum EnumeratorState { Before, Running, After }

	// Naming this class EnumeratorBase to avoid collision with IE.
	export class EnumeratorBase<T> extends DisposableBase implements IEnumerator<T>
	{

		private _yielder: Yielder<T>;
		private _state: EnumeratorState;

		get current(): T {
			return this._yielder.current;
		}

		// "Enumerator" is conflict JScript's "Enumerator"
		constructor(
			private initializer: () => void, private tryGetNext: (yielder: IYield<T>) => boolean, private disposer?: () => void) {
			super();
			this.reset();
		}


		reset(): void {
			var _ = this;
			_._yielder = new Yielder<T>();
			_._state = EnumeratorState.Before;
		}

		moveNext(): boolean {
			var _ = this;
			try {
				switch (_._state) {
					case EnumeratorState.Before:
						_._state = EnumeratorState.Running;
						var initializer = _.initializer;
						if (initializer)
							initializer();
					// fall through
					case EnumeratorState.Running:
						if (_.tryGetNext(_._yielder)) {
							return true;
						}
						else {
							this.dispose();
							return false;
						}
					case EnumeratorState.After:
						return false;
				}
			}
			catch (e) {
				this.dispose();
				throw e;
			}
		}

		_onDispose():void {
			var _ = this, disposer = _.disposer;

			_.initializer = null;
			_.disposer = null;

			var yielder = _._yielder;
			_._yielder = null;
			if (yielder)
				yielder.yieldBreak();

			try {

				if (disposer)
					disposer();

			}
			finally {
				//if(this._state==EnumeratorState.Running)
				this._state = EnumeratorState.After;
			}
		}

	}

	export class IndexEnumerator<T> extends EnumeratorBase<T> {

		constructor(
			sourceFactory: () => { source: { [index: number]: T }; pointer: number; length: number }) {

			var source: { source: { [index: number]: T }; pointer: number; length: number };
			super(
				() => {
					source = sourceFactory();
				},
				yielder => {
					var current = source.pointer++;
					return current < length ? yielder.yieldReturn(source.source[current]) : yielder.yieldBreak();
				},
				() => {
					source.source = null;
					source = null;
				});
		}
	}



	export class ArrayEnumerator<T> extends IndexEnumerator<T> {
		constructor(arrayFactory:()=>T[], start:number = 0) {
			super(() => {
				var array = arrayFactory();
				return { source: array, pointer: start, length: array.length };
			});
		}
	}
}