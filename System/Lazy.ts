///<reference path="IDisposable.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


module System {

	export interface ILazy<T> extends IDisposable
	{
		value:T;
		isValueCreated:boolean;
	}

	export class Lazy<T> extends DisposableBase implements ILazy<T>
	{

		private _isValueCreated:boolean;
		private _value:T;

		constructor(private _closure:()=>T)
		{
			super();
		}

		get isValueCreated():boolean
		{
			return this._isValueCreated;
		}

		reset():void {
			var _ = this;
			if(!_._closure)
				throw new Error("Cannot reset.  This Lazy has de-referenced its closure.");

			_._isValueCreated = false;
			_._value = null;
		}

		get value():T
		{
			var _ = this;
			if(!_._isValueCreated && _._closure)
			{
				var v = _._closure();
				_._value = v;
				_._isValueCreated = true;
				return v;
			}

			return _._value;
		}

		valueOnce():T {
			try {
				return this.value;
			}
			finally {
				this._closure = null;
			}
		}


		_onDispose():void {
			this._closure = null;
			this._value = null;
		}
	}
	
}
