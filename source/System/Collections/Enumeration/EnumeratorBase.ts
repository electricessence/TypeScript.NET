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
import {Closure} from "../../FunctionTypes";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

const VOID0:undefined = void 0;

var yielderPool:ObjectPool<Yielder<any>>;
function yielder():Yielder<any>;
function yielder(recycle?:Yielder<any>):void;
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
enum EnumeratorState { Before, Running, Completed, Faulted, Interrupted, Disposed }

// "Enumerator" is conflict JScript's "Enumerator"
// Naming this class EnumeratorBase to avoid collision with IE.
export class EnumeratorBase<T> extends DisposableBase implements IEnumerator<T>
{

	private _yielder:Yielder<T>;
	private _state:EnumeratorState;
	private _disposer:()=>void;

	get current():T|undefined
	{
		var y = this._yielder;
		return y && y.current;
	}

	get index():number
	{
		var y = this._yielder;
		return y && y.index;
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
		private _initializer:Closure,
		private _tryGetNext:(yielder:IYield<T>) => boolean,
		disposer?:Closure|boolean|null,
		isEndless?:boolean)
	{
		super();
		this.reset();
		if(Type.isBoolean(isEndless))
			this._isEndless = isEndless;
		else if(Type.isBoolean(disposer))
			this._isEndless = disposer;

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

	reset():void
	{
		const _ = this;
		_.throwIfDisposed();
		var y = _._yielder;
		_._yielder = <any>null;

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
					_._state = EnumeratorState.Running;
					var initializer = _._initializer;
					if(initializer)
						initializer();
				// fall through
				case EnumeratorState.Running:
					if(_._tryGetNext(_._yielder))
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
		var disposer = _._disposer;

		_._initializer = <any>null;
		_._disposer = <any>null;


		var y = _._yielder;
		_._yielder = <any>null;
		this._state = EnumeratorState.Disposed;

		if(y) yielder(y);

		if(disposer)
			disposer();
	}

}

export default EnumeratorBase;
