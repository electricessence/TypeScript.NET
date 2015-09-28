/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based Upon: https://github.com/kriskowal/q
 */

/**
 * Basic promise interface defined by kriskowal.
 * Included for ease of use with other classes.
 */
interface IPromise<T> {

	then<TNext>(
		onFulfill?: (value: T) => TNext | IPromise<TNext>,
		onReject?: (error: any) => TNext | IPromise<TNext>): IPromise<TNext>;
}
