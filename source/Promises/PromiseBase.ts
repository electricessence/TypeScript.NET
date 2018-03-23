/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Closure} from "../FunctionTypes";
import {Executor, Fulfill, Reject, Resolution, Resolver} from "./PromiseTypes";
import {deferImmediate} from "../Threading/deferImmediate";
import {defer} from "../Threading/defer";
import PromiseState, {PromiseStateValue} from "./PromiseState";

export function handleDispatch<T, TFulfilled = T, TRejected = never>(
	p:PromiseLike<T>,
	onFulfilled:Fulfill<T, TFulfilled>,
	onRejected?:Reject<TRejected>):void
{
	if(p instanceof PromiseBase)
	{
		p.doneNow(onFulfilled, onRejected);
	}
	else
	{
		p.then(<any>onFulfilled, onRejected);
	}
}

export function handleResolutionMethods(
	targetFulfill:Fulfill<any, any>,
	targetReject:Reject<any>,
	value:Resolution<any>,
	resolver?:Resolver):void
{
	try
	{
		let v = resolver ? resolver(value) : value;
		if(targetFulfill) targetFulfill(v);
	}
	catch(ex)
	{ if(targetReject) targetReject(ex); }
}

export default abstract class PromiseBase<T>
	extends PromiseState<T>
	implements PromiseLike<T>// , Promise<T>
{
	//readonly [Symbol.toStringTag]: "Promise";

	constructor()
	{
		super(PromiseStateValue.Pending);
		(<any>this)._disposableObjectName = "PromiseState";
	}

	protected abstract create<TResult>(
		resolver?:Executor<TResult>,
		forceSynchronous?:boolean):PromiseBase<TResult>;

	/**
	 * .doneNow is provided as a non-standard means that synchronously resolves as the end of a promise chain.
	 * As stated by promisejs.org: 'then' is to 'done' as 'map' is to 'forEach'.
	 * It is the underlying method by which propagation occurs.
	 * @param onFulfilled
	 * @param onRejected
	 */
	abstract doneNow(
		onFulfilled:Fulfill<T, any>,
		onRejected?:Reject<any>):void;

	/**
	 * Calls the respective handlers once the promise is resolved.
	 * @param onFulfilled
	 * @param onRejected
	 */
	abstract thenSynchronous<TFulfilled = T, TRejected = never>(
		onFulfilled:Fulfill<T, TFulfilled>,
		onRejected?:Reject<TRejected>):PromiseBase<TFulfilled | TRejected>;

	/**
	 * Same as 'thenSynchronous' but does not return the result.  Returns the current promise instead.
	 * You may not need an additional promise result, and this will not create a new one.
	 * @param onFulfilled
	 * @param onRejected
	 */
	thenThis(
		onFulfilled:Fulfill<T, any>,
		onRejected?:Reject<any>):this
	{
		this.doneNow(onFulfilled, onRejected);
		return this;
	}


	/**
	 * Standard .then method that defers execution until resolved.
	 * @param onFulfilled
	 * @param onRejected
	 * @returns {TSDNPromise}
	 */

	then<TFulfilled = T, TRejected = never>(
		onFulfilled:Fulfill<T, TFulfilled>,
		onRejected?:Reject<TRejected>):PromiseBase<TFulfilled | TRejected>
	{
		this.throwIfDisposed();

		return this.create<TFulfilled | TRejected>((resolve, reject) => {
			this.doneNow(
				result =>
					handleResolutionMethods(resolve, reject, result, onFulfilled),
				error =>
					onRejected
						? handleResolutionMethods(resolve, reject, error, onRejected)
						: reject(error)
			);
		});
	}

	/**
	 * Same as .then but doesn't trap errors.  Exceptions may end up being fatal.
	 * @param onFulfilled
	 * @param onRejected
	 * @returns {TSDNPromise}
	 */
	thenAllowFatal<TFulfilled = T, TRejected = never>(
		onFulfilled:Fulfill<T, TFulfilled>,
		onRejected?:Reject<TRejected>):PromiseBase<TFulfilled | TRejected>
	{
		this.throwIfDisposed();

		return this.create<TFulfilled | TRejected>((resolve, reject) => {
			this.doneNow(
				result =>
					resolve(<any>(onFulfilled ? onFulfilled(result) : result)),
				error =>
					reject(onRejected ? onRejected(error) : error)
			);
		});
	}


	/**
	 * .done is provided as a non-standard means that maps to similar functionality in other promise libraries.
	 * As stated by promisejs.org: 'then' is to 'done' as 'map' is to 'forEach'.
	 * @param onFulfilled
	 * @param onRejected
	 */
	done(
		onFulfilled:Fulfill<T, any>,
		onRejected?:Reject<any>):void
	{
		defer(() => this.doneNow(onFulfilled, onRejected));
	}

	/**
	 * Will yield for a number of milliseconds from the time called before continuing.
	 * @param milliseconds
	 * @returns A promise that yields to the current execution and executes after a delay.
	 */
	delayFromNow(milliseconds:number = 0):PromiseBase<T>
	{
		this.throwIfDisposed();

		return this.create<T>(
			(resolve, reject) => {
				defer(() => {
					this.doneNow(
						v => resolve(v),
						e => reject(e));
				}, milliseconds)
			},
			true // Since the resolve/reject is deferred.
		);
	}

	/**
	 * Will yield for a number of milliseconds from after this promise resolves.
	 * If the promise is already resolved, the delay will start from now.
	 * @param milliseconds
	 * @returns A promise that yields to the current execution and executes after a delay.
	 */
	delayAfterResolve(milliseconds:number = 0):PromiseBase<T>
	{
		this.throwIfDisposed();

		if(this.isSettled) return this.delayFromNow(milliseconds);

		return this.create<T>(
			(resolve, reject) => {
				this.doneNow(
					v => defer(() => resolve(v), milliseconds),
					e => defer(() => reject(e), milliseconds))
			},
			true // Since the resolve/reject is deferred.
		);
	}

	/**
	 * Shortcut for trapping a rejection.
	 * @param onRejected
	 * @returns {PromiseBase<TResult>}
	 */
	'catch'<TResult = never>(onRejected:Reject<TResult>):PromiseBase<T | TResult>
	{
		return this.then(null, onRejected)
	}

	/**
	 * Shortcut for trapping a rejection but will allow exceptions to propagate within the onRejected handler.
	 * @param onRejected
	 * @returns {PromiseBase<TResult>}
	 */
	catchAllowFatal<TResult = never>(onRejected:Reject<TResult>):PromiseBase<T | TResult>
	{
		return this.thenAllowFatal(null, onRejected)
	}

	/**
	 * Shortcut to for handling either resolve or reject.
	 * @param fin
	 * @returns {PromiseBase<TResult>}
	 */
	'finally'<TResult = never>(fin:() => Resolution<TResult>):PromiseBase<TResult>
	{
		return this.then(fin, fin);
	}

	/**
	 * Shortcut to for handling either resolve or reject but will allow exceptions to propagate within the handler.
	 * @param fin
	 * @returns {PromiseBase<TResult>}
	 */
	finallyAllowFatal<TResult = never>(fin:() => Resolution<TResult>):PromiseBase<TResult>
	{
		return this.thenAllowFatal(fin, fin);
	}

	/**
	 * Shortcut to for handling either resolve or reject.  Returns the current promise instead.
	 * You may not need an additional promise result, and this will not create a new one.
	 * @param fin
	 * @param synchronous
	 * @returns {PromiseBase}
	 */
	finallyThis(fin:Closure, synchronous?:boolean):this
	{
		const f:Closure = synchronous ? fin : () => deferImmediate(fin);
		this.doneNow(f, f);
		return this;
	}

}

