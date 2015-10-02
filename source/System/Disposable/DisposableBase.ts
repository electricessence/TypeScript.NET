/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


///<reference path="IDisposableAware.d.ts"/>

import ObjectDisposedException = require('./ObjectDisposedException');

class DisposableBase implements IDisposableAware
{

	constructor(private _finalizer?:() => void)
	{
	}

	private _wasDisposed:boolean = false;
	get wasDisposed():boolean
	{
		return this._wasDisposed;
	}

	// Allow for simple override of name.
	protected _disposableObjectName:string;

	protected throwIfDisposed(
		message?:string,
		objectName:string = this._disposableObjectName):boolean
	{
		if(this._wasDisposed)
			throw new ObjectDisposedException(objectName, message);
		return true;
	}


	dispose():void
	{
		var _ = this;
		if(!_._wasDisposed)
		{
			// Preemptively set wasDisposed in order to prevent repeated disposing.
			// NOTE: in true multi-threaded scenarios, this needs to be synchronized.
			_._wasDisposed = true;
			try
			{
				_._onDispose(); // Protected override.
			}
			finally
			{
				if(_._finalizer) // Private finalizer...
					_._finalizer();
			}
		}
	}

	// Override this to handle destruction...
	// Be sure to call super._onDestroy() in deeper sub classes...
	protected _onDispose():void
	{

	}

}

export = DisposableBase;
