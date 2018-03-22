/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import DisposableBase from "../Disposable/DisposableBase";

export default class PromiseState<T>
	extends DisposableBase
{

	constructor(
		protected _state:PromiseStateValue,
		protected _result?:T,
		protected _error?:any)
	{
		super("PromiseState");
	}

	protected _onDispose():void
	{
		this._state = <any>null;
		this._result = <any>null;
		this._error = <any>null;
	}

	protected getState():PromiseStateValue
	{
		return this._state;
	}

	get state():PromiseStateValue
	{
		return this._state;
	}

	get isPending():boolean
	{
		return this.getState()===PromiseStateValue.Pending;
	}

	get isSettled():boolean
	{
		return this.getState()!=PromiseStateValue.Pending; // Will also include undefined==0 aka disposed!=resolved.
	}

	get isFulfilled():boolean
	{
		return this.getState()===PromiseStateValue.Fulfilled;
	}

	get isRejected():boolean
	{
		return this.getState()===PromiseStateValue.Rejected;
	}

	/*
	 * Providing overrides allows for special defer or lazy sub classes.
	 */
	protected getResult():T | undefined
	{
		return this._result;
	}

	get result():T | undefined
	{
		this.throwIfDisposed();
		return this.getResult();
	}

	protected getError():any
	{
		return this._error;
	}

	get error():any
	{
		this.throwIfDisposed();
		return this.getError();
	}

}

/**
 * The state of a promise.
 * https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md
 * If a promise is disposed the value will be undefined which will also evaluate (promise.state)==false.
 */
export enum PromiseStateValue
{
	Pending   = 0,
	Fulfilled = 1,
	Rejected  = -1
}

Object.freeze(PromiseStateValue);
