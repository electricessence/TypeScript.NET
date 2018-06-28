/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Type} from "../../Types";
import {DisposableBase} from "../../Disposable/DisposableBase";
import {ObjectPool} from "../../Disposable/ObjectPool";
import {IDisposable} from "../../Disposable/IDisposable";
import {IEnumerator} from "./IEnumerator";
import {IIteratorResult} from "./IIterator";
import {IYield} from "./IYield";
import {IteratorResult} from "./IteratorResult";
import __extendsImport from "../../../extends";
import {Action, Closure} from "../../FunctionTypes";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

const VOID0:undefined = void 0;

let yielderPool:ObjectPool<Yielder<any>>;
function yielder():Yielder<any>;
function yielder(recycle?:Yielder<any>):void;
//noinspection JSUnusedLocalSymbols
function yielder(recycle?:Yielder<any>):Yielder<any>|void
{
	if(!yielderPool)
		yielderPool
			= new ObjectPool<Yielder<any>>(40, ()=>new Yielder<any>(), y=>y.yieldBreak());
	if(!recycle) return yielderPool.take();
	yielderPool.add(recycle);
}

class Yielder<T> implements IYield<T>, IDisposable
{
	private _current:T|undefined = VOID0;
	private _index:number = NaN;

	get current():T|undefined { return this._current; } // this class is not entirely local/private.  Still needs protection.

	get index():number { return this._index; }

	yieldReturn(value:T):boolean
	{
		this._current = value;
		if(isNaN(this._index))
			this._index = 0;
		else
			this._index++;
		return true;
	}

	yieldBreak():boolean
	{
		this._current = VOID0;
		this._index = NaN;
		return false;
	}

	dispose():void
	{
		this.yieldBreak();
	}
}

// IEnumerator State
const enum EnumeratorState { Before, Active, Completed, Faulted, Interrupted, Disposed }

const NAME = "EnumeratorBase";

// "Enumerator" is conflict JScript's "Enumerator"
// Naming this class EnumeratorBase to avoid collision with IE.
export class EnumeratorBase<T> extends DisposableBase implements IEnumerator<T>
{

	private _yielder:Yielder<T>|undefined;
	// @ts-ignore;
	private _state:EnumeratorState;
	private _disposer:Closure|undefined;

	get current():T|undefined
	{
		const y = this._yielder;
		return y && y.current;
	}

	get index():number
	{
		const y = this._yielder;
		return y ? y.index : NaN;
	}

	constructor(
		initializer:Closure|null,
		tryGetNext:(yielder:IYield<T>) => boolean,
		isEndless?:boolean);
	constructor(
		initializer:Closure|null,
		tryGetNext:(yielder:IYield<T>) => boolean,
		disposer?:Closure|null,
		isEndless?:boolean);
	constructor(
		private _initializer:Closure|null,
		private _tryGetNext:(yielder:IYield<T>) => boolean,
		disposer?:Closure|boolean|null,
		isEndless?:boolean)
	{
		super(NAME);
		this.reset();
		if(Type.isBoolean(isEndless))
			this._isEndless = isEndless;
		else if(Type.isBoolean(disposer))
			this._isEndless = disposer;
		else
			this._isEndless = false;

		if(Type.isFunction(disposer))
			this._disposer = disposer;
	}

	protected _isEndless:boolean;
	/*
	 * Provides a mechanism to indicate if this enumerable never ends.
	 * If set to true, some operations that expect a finite result may throw.
	 * Explicit false means it has an end.
	 * Implicit void means unknown.
	 */
	get isEndless():boolean|undefined
	{
		return this._isEndless;
	}

	/**
	 * Added for compatibility but only works if the enumerator is active.
	 */
	reset():void
	{
		const _ = this;
		_.throwIfDisposed();
		const y = _._yielder;
		_._yielder = undefined;

		_._state = EnumeratorState.Before;

		if(y) yielder(y); // recycle until actually needed.
	}

	private _assertBadState() {
		const _ = this;
		switch(_._state)
		{
			case EnumeratorState.Faulted:
				_.throwIfDisposed("This enumerator caused a fault and was disposed.");
				break;
			case EnumeratorState.Disposed:
				_.throwIfDisposed("This enumerator was manually disposed.");
				break;
		}
	}

	/**
	 * Passes the current value to the out callback if the enumerator is active.
	 * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
	 */
	tryGetCurrent(out:Action<T>):boolean {
		this._assertBadState();
		if(this._state===EnumeratorState.Active) {
			out(<T>this.current);
			return true;
		}
		return false;
	}

	get canMoveNext():boolean {
		return this._state < EnumeratorState.Completed;
	}

	/**
	 * Safely moves to the next entry and returns true if there is one.
	 * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
	 */
	moveNext():boolean
	{
		const _ = this;

		_._assertBadState();

		try
		{
			switch(_._state)
			{
				case EnumeratorState.Before:
					_._yielder = _._yielder || yielder();
					_._state = EnumeratorState.Active;
					const initializer = _._initializer;
					if(initializer)
						initializer();
				// fall through
				case EnumeratorState.Active:
					if(_._tryGetNext(_._yielder!))
					{
						return true;
					}
					else
					{
						this.dispose();
						_._state = EnumeratorState.Completed;
						return false;
					}
				default:
					return false;
			}
		}
		catch(e)
		{
			this.dispose();
			_._state = EnumeratorState.Faulted;
			throw e;
		}
	}

	/**
	 * Moves to the next entry and emits the value through the out callback.
	 * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
	 */
	tryMoveNext(out:Action<T>):boolean {
		if(this.moveNext()) {
			out(<T>this.current);
			return true;
		}
		return false;
	}

	nextValue():T|undefined
	{
		return this.moveNext()
			? this.current
			: VOID0;
	}

	/**
	 * Exposed for compatibility with generators.
	 */
	next():IIteratorResult<T>
	{
		return this.moveNext()
			? new IteratorResult(this.current, this.index)
			: IteratorResult.Done
	}

	end():void {
		this._ensureDisposeState(EnumeratorState.Interrupted);
	}

	'return'():IIteratorResult<void>
	'return'<TReturn>(value:TReturn):IIteratorResult<TReturn>
	'return'(value?:any):IIteratorResult<any>
	{
		const _ = this;
		_._assertBadState();

		try
		{
			return value===VOID0 || _._state===EnumeratorState.Completed || _._state===EnumeratorState.Interrupted
				? IteratorResult.Done
				: new IteratorResult(value, VOID0, true);
		}
		finally
		{
			_.end();
		}
	}

	private _ensureDisposeState(state:EnumeratorState):void {
		const _ = this;
		if(!_.wasDisposed) {
			_.dispose();
			_._state = state;
		}
	}

	protected _onDispose():void
	{
		const _ = this;
		_._isEndless = false;
		const disposer = _._disposer;

		_._initializer = <any>null;
		_._disposer = <any>null;


		const y = _._yielder;
		_._yielder = undefined;
		this._state = EnumeratorState.Disposed;

		if(y) yielder(y);

		if(disposer)
			disposer();
	}

}

export default EnumeratorBase;
