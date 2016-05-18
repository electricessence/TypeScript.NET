/*!
 * @author electricessence / https://github.com/electricessence/
 * Based on Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {IDisposable} from "../Disposable/IDisposable";

/**
 * A simple event dispatcher provided as an alternative to built-in event.
 * If just dispatching a payload to a uniform set of functions, it may be better to just use the utilities in System/Collections/Array/Dispatch.
 */
export default class EventSimple<T extends Function> implements IDisposable
{
	private _listeners:T[] = [];

	add(listener:T):void
	{
		this._listeners.push(listener);
	}

	remove(listener:T):void
	{
		var index = this._listeners.indexOf(listener);
		if(index<0) return;
		this._listeners.splice(index, 1);
	}

	dispatch(...params:any[]):void
	{
		var listeners = this._listeners;
		for(var f of listeners)
		{
			f.call(params);
		}
	}

	toMulticastFunction():Function
	{
		var listeners = this._listeners;
		return function()
		{
			for(var f of listeners)
			{
				f.call(arguments);
			}
		};
	}

	dispose():void
	{
		this._listeners.length = 0;
	}
}