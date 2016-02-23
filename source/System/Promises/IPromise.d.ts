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

interface IPromise<T>
{
	then<TResult>(
		onFulfilled:(value:T) => TResult | IPromise<TResult>,
		onRejected:(reason:any) => TResult | IPromise<TResult>): IPromise<TResult>;
}
