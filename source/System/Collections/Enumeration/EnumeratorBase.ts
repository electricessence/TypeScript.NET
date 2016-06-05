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
const __extends = __extendsImport;

const VOID0:any = void(0);

var yielderPool:ObjectPool<Yielder<any>>;
function yielder():Yielder<any>;
function yielder(recycle?:Yielder<any>):void;
function yielder(recycle?:Yielder<any>):Yielder<any>
{
	if(!yielderPool)
		yielderPool
			= new ObjectPool<Yielder<any>>(40, ()=>new Yielder<any>(),y=>y.yieldBreak());
	if(!recycle) return yielderPool.take();
	yielderPool.add(recycle);
}

class Yielder<T> implements IYield<T>, IDisposable
{
	private _current:T = VOID0;
	private _index:number;

	get current():T { return this._current; } // this class is not entirely local/private.  Still needs protection.

	get index():number { return this._index; }

	yieldReturn(value:T):boolean
	{
		this._current = value;
		if(this._index===VOID0)
			this._index = 0;
		else
			this._index++;
		return true;
	}

	yieldBreak():boolean
	{
		this._current = VOID0;
		this._index = VOID0;
		return false;
	}

	dispose():void
	{
		this.yieldBreak();
	}
}

type ActionVoid = ()=>void;

// IEnumerator State
enum EnumeratorState { Before, Running, After }

// "Enumerator" is conflict JScript's "Enumerator"
// Naming this class EnumeratorBase to avoid collision with IE.
export class EnumeratorBase<T> extends DisposableBase implements IEnumerator<T>
{

	private _yielder:Yielder<T>;
	private _state:EnumeratorState;
	private _disposer:()=>void;

	get current():T
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
		initializer:() => void,
		tryGetNext:(yielder:IYield<T>) => boolean,
		isEndless?:boolean);
	constructor(
		initializer:() => void,
		tryGetNext:(yielder:IYield<T>) => boolean,
		disposer?:()=>void,
		isEndless?:boolean);
	constructor(
		private _initializer:() => void,
		private _tryGetNext:(yielder:IYield<T>) => boolean,
		disposer?:ActionVoid|boolean,
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
	get isEndless():boolean
	{
		return this._isEndless;
	}

	reset():void
	{
		var _ = this;
		_.throwIfDisposed();
		var y = _._yielder;
		_._yielder = null;

		_._state = EnumeratorState.Before;

		if(y) yielder(y); // recycle until actually needed.
	}

	moveNext():boolean
	{
		var _ = this;
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
						return false;
					}
				case EnumeratorState.After:
					return false;
			}
		}
		catch(e)
		{
			this.dispose();
			throw e;
		}
	}

	nextValue():T
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

	'return'():IIteratorResult<void>
	'return'<TReturn>(value:TReturn):IIteratorResult<TReturn>
	'return'(value?:any):IIteratorResult<any>
	{
		try
		{
			return value===VOID0 || this._state===EnumeratorState.After
				? IteratorResult.Done
				: new IteratorResult(value, VOID0, true);
		}
		finally
		{
			this.dispose();
		}
	}

	protected _onDispose():void
	{
		var _ = this, disposer = _._disposer;

		_._initializer = null;
		_._disposer = null;


		var y = _._yielder;
		_._yielder = null;
		this._state = EnumeratorState.After;

		if(y) yielder(y);

		if(disposer)
			disposer();
	}

}

export default EnumeratorBase;
