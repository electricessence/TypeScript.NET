/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


///<reference path="IDisposableAware.d.ts"/>

'use strict';

//class ObjectDisposedException extends Exception {
//
//}

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

	// This allows for the use of a boolean instead of calling this.assertIsNotDisposed() since there is a strong chance of introducing a circular reference.
	static assertIsNotDisposed(disposed:boolean, errorMessage:string = "ObjectDisposedException"):boolean
	{
		if(disposed)
			throw new Error(errorMessage);

		return true;
	}

	assertIsNotDisposed(errorMessage:string = "ObjectDisposedException"):boolean
	{
		return DisposableBase.assertIsNotDisposed(this._wasDisposed, errorMessage);
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
