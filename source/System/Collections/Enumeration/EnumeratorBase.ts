/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../../Disposable/IDisposable.d.ts"/>
///<reference path="IEnumerator.d.ts"/>
///<reference path="IYield.d.ts"/>
///<reference path="IIterator.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import DisposableBase from "../../Disposable/DisposableBase";
import ObjectPool from "../../Disposable/ObjectPool";

const VOID0:any = void(0);

var yielderPool:ObjectPool<Yielder<any>>;
function yielder():Yielder<any>;
function yielder(recycle?:Yielder<any>):void;
function yielder(recycle?:Yielder<any>):Yielder<any>
{
	if(!yielderPool)
		yielderPool
			= new ObjectPool<Yielder<any>>(40, ()=>new Yielder<any>());
	if(!recycle) return yielderPool.take();
	recycle.yieldBreak();
	yielderPool.add(recycle);
}

class Yielder<T> implements IYield<T>, IDisposable
{
	private _current:T = VOID0;
	get current():T { return this._current; }

	yieldReturn(value:T):boolean
	{
		this._current = value;
		return true;
	}

	yieldBreak():boolean
	{
		this._current = VOID0;
		return false;
	}

	dispose():void
	{
		this.yieldBreak();
	}
}


// IEnumerator State
enum EnumeratorState { Before, Running, After }

// Naming this class EnumeratorBase to avoid collision with IE.
export default
class EnumeratorBase<T> extends DisposableBase implements IEnumerator<T>
{

	private _yielder:Yielder<T>;
	private _state:EnumeratorState;

	get current():T
	{
		return this._yielder.current;
	}

	// "Enumerator" is conflict JScript's "Enumerator"
	constructor(
		private initializer:() => void,
		private tryGetNext:(yielder:IYield<T>) => boolean,
		private disposer?:() => void)
	{
		super();
		this.reset();
	}


	reset():void
	{
		var _ = this;
		_.throwIfDisposed();
		var y = _._yielder;
		if(y) y.yieldBreak(); // Already exists? Reset.
		else _._yielder = yielder(); // New? Get one from the object pool.
		_._state = EnumeratorState.Before;
	}

	moveNext():boolean
	{
		var _ = this;
		try
		{
			switch(_._state)
			{
				case EnumeratorState.Before:
					_._state = EnumeratorState.Running;
					var initializer = _.initializer;
					if(initializer)
						initializer();
				// fall through
				case EnumeratorState.Running:
					if(_.tryGetNext(_._yielder))
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
			? this._yielder.current
			: VOID0;
	}

	/**
	 * Exposed for compatibility with generators.
	 */
	next():IIteratorResult<T>
	{
		return this.moveNext() ?
		{
			value: this._yielder.current,
			done: false
		} : {
			value: VOID0,
			done: true
		}
	}

	protected _onDispose():void
	{
		var _ = this, disposer = _.disposer;

		_.initializer = null;
		_.disposer = null;


		var y = _._yielder;
		_._yielder = null;
		yielder(y);

		try
		{
			if(disposer)
				disposer();
		}
		finally
		{
			//if(this._state==EnumeratorState.Running)
			this._state = EnumeratorState.After;
		}
	}

}
