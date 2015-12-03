/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */

///<reference path="PromiseState.d.ts"/>

/**
 * Basic promise interface.
 * Included for ease of use with other classes.
 */
interface IPromiseMinimal<T>
{
	then<U>(
		onFulfill?:(value:T) => U | IPromiseMinimal<U>,
		onReject?:(error:any) => U | IPromiseMinimal<U>): IPromiseMinimal<U>;
}

interface IPromise<T>
extends IPromiseMinimal<T>
{
	/**
	 * A sugar method, equivalent to promise.then(undefined, onRejected).
	 */
	'catch'<U>(onRejected:(reason:any) => U | IPromiseMinimal<U>): IPromise<U>;

	/**
	 * Like a finally clause, allows you to observe either the fulfillment or rejection of a promise, but to do so without modifying the final value. This is useful for collecting resources regardless of whether a job succeeded, like closing a database connection, shutting a server down, or deleting an unneeded key from an object.
	 * finally returns a promise, which will become resolved with the same fulfillment value or rejection reason as promise. However, if callback returns a promise, the resolution of the returned promise will be delayed until the promise returned from callback is finished.
	 */
	'finally'(finallyCallback:() => any): IPromise<T>;
}

interface IPromiseWithState<T>
extends IPromise<T>
{
	state:IPromiseState<T>;

	/**
	 * Returns whether a given promise is in the fulfilled state. When the static version is used on non-promises, the result is always true.
	 */
	isFulfilled: boolean;
	/**
	 * Returns whether a given promise is in the rejected state. When the static version is used on non-promises, the result is always false.
	 */
	isRejected: boolean;
	/**
	 * Returns whether a given promise is in the pending state. When the static version is used on non-promises, the result is always false.
	 */
	isPending: boolean;
}

interface IPromiseWithProgress<T>
extends IPromiseWithState<T>{
	/**
	 * The then method from the Promises/A+ specification, with an additional progress handler.
	 */
	then<U>(
			onFulfill?: (value: T) => U | IPromiseMinimal<U>,
			onReject?: (error: any) => U | IPromiseMinimal<U>,
			onProgress?: Function): IPromiseWithProgress<U>;

	/**
	 * A sugar method, equivalent to promise.then(undefined, undefined, onProgress).
	 */
	progress(onProgress: (progress: any) => any): IPromiseWithProgress<T>;
}


