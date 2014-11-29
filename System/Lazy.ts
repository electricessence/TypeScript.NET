///<reference path="IDisposable.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

// Ensure this is loaded before Lazy<T>.
import DisposableBase = System.DisposableBase;

module System {

	export interface ILazy<T> extends IDisposable, IEquatable<ILazy<T>>
	{
		value:T;
		isValueCreated:boolean;
	}

	export class Lazy<T> extends DisposableBase implements ILazy<T>
	{

		private _isValueCreated:boolean;
		private _value:T;

		constructor(private _closure:Func<T>)
		{
			super();
		}

		get isValueCreated():boolean
		{
			return this._isValueCreated;
		}

		// Adding a 'resetable' mechanism allows for simply resetting a lazy instead of reinstantiating a new one.
		get canReset(): boolean
		{
			return !this.wasDisposed && !!(this._closure);
		}

		// Returns true if succesfully reset.
		reset(throwIfCannotReset?:boolean):boolean {
			var _ = this;

			if (throwIfCannotReset)
				_.assertIsNotDisposed();

			if (!_._closure)
			{
				if (throwIfCannotReset)
					throw new Error("Cannot reset.  This Lazy has already de-referenced its closure.");
				return false;
			} else
			{
				_._isValueCreated = false;
				_._value = null;
				return true;
			}
		}

		get value():T
		{
			return this.getValue();
		}

		getValue(clearClosureReference?:boolean):T {

			var _ = this;

			_.assertIsNotDisposed();

			try
			{
				if (!_._isValueCreated && _._closure)
				{
					var v = _._closure();
					_._value = v;
					_._isValueCreated = true;
					return v;
				}
			}
			finally
			{
				if(clearClosureReference)
					_._closure = null;
			}

			return _._value;

		}


		_onDispose():void {
			this._closure = null;
			this._value = null;
		}

		equals(other: Lazy<T>): boolean
		{
			return this == other;
		}

		valueEquals(other: Lazy<T>): boolean
		{
			return this.equals(other) || this.value === other.value;
		}
	}
	
}
