/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {DisposableBase} from "./Disposable/DisposableBase";
import {ILazy} from "./ILazy";
import {Func} from "./FunctionTypes";
import {ArgumentNullException} from "./Exceptions/ArgumentNullException";

// We need a non-resettable lazy to ensure it can be passed safely around.
export class Lazy<T> extends DisposableBase implements ILazy<T>
{

	protected _isValueCreated:boolean;
	protected _value:T;

	constructor(protected _closure:Func<T>)
	{
		super();
		if(!_closure) throw new ArgumentNullException("_closure");
		this._disposableObjectName = 'Lazy';
	}

	get isValueCreated():boolean
	{
		return this._isValueCreated;
	}

	get value():T
	{
		return this.getValue();
	}

	protected _error:any;
	get error():any {
		return this._error;
	}

	getValue():T {

		var _ = this;

		_.throwIfDisposed();

		try {
			if(!_._isValueCreated && _._closure) {
				var v = _._closure();
				_._value = v;
				_._error = void 0;
				return v;
			}
		}
		catch(ex) {
			_._error = ex;
			throw ex;
		}
		finally {
			_._onValueRequested();
			_._isValueCreated = true;
		}

		return _._value;

	}

	protected _onValueRequested() {
		this._closure = null;
	}


	protected _onDispose():void {
		this._closure = null;
		this._value = null;
	}

	equals(other:Lazy<T>):boolean
	{
		return this==other;
	}

	valueEquals(other:Lazy<T>):boolean
	{
		return this.equals(other) || this.value===other.value;
	}
}

export class ResettableLazy<T> extends Lazy<T> {



	getValue(clearClosureReference?:boolean):T {

		var v = super.getValue();
		if(clearClosureReference) super._onValueRequested();
		return v;
	}

	protected _onValueRequested() {
		// Do nothing special...
	}

	// Adding a 'resettable' mechanism allows for simply resetting a lazy instead of re-instantiating a new one.
	get canReset():boolean
	{
		return !this.wasDisposed && !!(this._closure);
	}

	// Returns true if successfully reset.
	reset(throwIfCannotReset?:boolean):boolean {
		var _ = this;

		if(throwIfCannotReset)
			_.throwIfDisposed();

		if(!_._closure) {
			if(throwIfCannotReset)
				throw new Error("Cannot reset.  This Lazy has already de-referenced its closure.");
			return false;
		}
		else {
			_._isValueCreated = false;
			_._value = null;
			_._error = void 0;
			return true;
		}
	}


}

export default Lazy;