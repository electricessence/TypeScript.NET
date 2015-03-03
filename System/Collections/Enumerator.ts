///<reference path="../IDisposable.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Collections {

	"use strict";

	export interface IYield<T> {
		current: T;
		yieldReturn(value: T): boolean;
		yieldBreak(): boolean;
	}

	class Yielder<T> implements IYield<T>
	{
		private _current: T;
		get current(): T { return this._current; }

		yieldReturn(value: T): boolean {
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

	// Statics only...  No constructor...
	export module Enumerator {
		// Could be array, or IEnumerable...
		export function from<T>(source: any): IEnumerator<T>
		{
			if (source instanceof Array)
				return new ArrayEnumerator<T>(source);

			if (typeof source === System.Types.Object && "length" in source)
				return new IndexEnumerator<T>(() =>
				{
					return {
						source: source,
						length: source.length,
						pointer: 0,
						step: 1
					}
				});

			if ("getEnumerator" in source)
				return source.getEnumerator();

			throw new Error("Unknown enumerable.");
		}

		export function forEach<T>(
			e: IEnumerator<T>, 
			action: (element: T, index?: number) => any): void
		{
			if (e)
			{
				var index = 0;
				// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
				while (e.moveNext())
				{
					if (action(e.current, index++) === false)
						break;
				}
			}
		}
	}

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
			private initializer: () => void,
			private tryGetNext: (yielder: IYield<T>) => boolean,
			private disposer?: () => void)
		{
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

		_onDispose(): void {
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
			sourceFactory: () => { source: { [index: number]: T }; pointer: number; length: number; step: number }) {

			var source: { source: { [index: number]: T }; pointer: number; length: number; step: number };
			super(
				() => {
					source = sourceFactory();
					if (source && source.source) {
						if (source.length && source.step === 0)
							throw new Error("Invalid IndexEnumerator step value (0).");

						var pointer = source.pointer;
						if (!pointer)
							source.pointer = 0 | 0;
						else if (pointer != Math.floor(pointer))
							throw new Error("Invalid IndexEnumerator pointer value (" + pointer + ") has decimal.");
						source.pointer = pointer | 0;

						var step = source.step;
						if (!step)
							source.step = 1;
						else if (step != Math.floor(step))
							throw new Error("Invalid IndexEnumerator step value (" + step + ") has decimal.");
						source.step = step | 0;
					}
				},
				yielder => {
					var len = (source && source.source) ? source.length : 0;
					if (!len)
						return yielder.yieldBreak();
					var current = source.pointer | 0;
					source.pointer += source.step;
					return (current < len && current >= 0)
						? yielder.yieldReturn(source.source[current])
						: yielder.yieldBreak();
				},
				() => {
					if (source) {
						source.source = null;
					}
				});
		}
	}



	export class ArrayEnumerator<T> extends IndexEnumerator<T> {
		constructor(arrayFactory: () => IArray<T>, start?: number, step?: number);
		constructor(array: IArray<T>, start?: number, step?: number);
		constructor(arrayOrFactory: any, start: number = 0, step: number = 1) {
			super(() => {
				var array = System.Types.isFunction(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
				return { source: array, pointer: start, length: (array ? array.length : 0), step: step };
			});
		}
	}
}