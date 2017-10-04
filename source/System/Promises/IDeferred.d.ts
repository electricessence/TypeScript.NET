/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */

///<reference path="IPromise.d.ts"/>

interface IDeferredMinimal<T>
{
	promise: IPromiseMinimal<T>;
	resolve(value:T): void;
	reject(reason:any): void;
	//makeNodeResolver(): (reason:any, value:T) => void;
}

interface IDeferred<T>
extends IDeferredMinimal<T>
{
	promise: IPromise<T>;
}

interface IDeferredWithState<T>
extends IDeferred<T>
{
	promise: IPromiseWithState<T>;
}

interface IDeferredWithProgress<T>
extends IDeferredWithState<T>
{
	promise: IPromiseWithProgress<T>;
	notify(value:any): void;
}