/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import ArgumentException from "../Exceptions/ArgumentException";
import Promise, {Resolvable} from "./Promise";
import ArgumentNullException from "../Exceptions/ArgumentNullException";
import isPromise from "./Functions/isPromise";
import {PromiseStateValue} from "./PromiseState";
import {Fulfill, Reject} from "./PromiseTypes";
import PromiseBase, {handleDispatch, handleResolutionMethods} from "./PromiseBase";

const TARGET = "target";
/**
 * Provided as a means for extending the interface of other PromiseLike<T> objects.
 */
export default class PromiseWrapper<T>
	extends Resolvable<T>
{
	constructor(private _target:PromiseLike<T>)
	{
		super();

		if(!_target)
			throw new ArgumentNullException(TARGET);

		if(!isPromise(_target))
			throw new ArgumentException(TARGET, "Must be a promise-like object.");

		_target.then(
			(v:T) => {
				this._state = PromiseStateValue.Fulfilled;
				this._result = v;
				this._error = <any>null;
				this._target = <any>null;
			},
			e => {
				this._state = PromiseStateValue.Rejected;
				this._error = e;
				this._target = <any>null;
			})
	}

	thenSynchronous<TFulfilled = T, TRejected = never>(
		onFulfilled:Fulfill<T, TFulfilled>,
		onRejected?:Reject<TRejected>):PromiseBase<TFulfilled | TRejected>
	{
		this.throwIfDisposed();

		let t = this._target;
		if(!t) return super.thenSynchronous(onFulfilled, onRejected);

		return new Promise<TFulfilled | TRejected>((resolve, reject) => {
			handleDispatch(t,
				result => handleResolutionMethods(resolve, reject, result, onFulfilled),
				error => onRejected
					? handleResolutionMethods(resolve, null, error, onRejected)
					: reject(error)
			);
		}, true);
	}

	doneNow(
		onFulfilled:Fulfill<T, any>,
		onRejected?:Reject<any>):void
	{
		this.throwIfDisposed();

		let t = this._target;
		if(t)
			handleDispatch(t, onFulfilled, onRejected);
		else
			super.doneNow(onFulfilled, onRejected);
	}

	protected _onDispose():void
	{
		super._onDispose();
		this._target = <any>null;
	}

}

