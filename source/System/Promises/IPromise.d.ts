/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based Upon: https://github.com/Microsoft/TypeScript/issues/1664
 */

/**
 * Basic promise interface.
 * Included for ease of use with other classes.
 * Will eventually be included in lib.d.ts.
 */


interface IPromiseConstructor<T>
{
	new (
		init:(
			resolve:(value:T | IPromise<T>) => void,
			reject:(reason:any) => void) => void): IPromise<T>;
}

/**
 * Taken from lib core for availability and compatibility.
 */
interface IPromise<T>
{
	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 * @param onFulfilled The callback to execute when the Promise is resolved.
	 * @param onRejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	then<TResult>(
		onFulfilled?: (value: T) => TResult | PromiseLike<TResult>,
		onRejected?: (reason: any) => TResult | PromiseLike<TResult>): IPromise<TResult>;

	then<TResult>(
		onFulfilled?: (value: T) => TResult | PromiseLike<TResult>,
		onRejected?: (reason: any) => void): IPromise<TResult>;

	/**
	 * Attaches a callback for only the rejection of the Promise.
	 * @param onRejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of the callback.
	 */
	'catch'(onRejected?: (reason: any) => T | PromiseLike<T>): IPromise<T>;
	'catch'(onRejected?: (reason: any) => void): IPromise<T>;
}
