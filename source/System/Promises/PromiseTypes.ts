/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Selector} from "../FunctionTypes";

export type Resolution<TResult> = TResult | PromiseLike<TResult>;

export type Fulfill<T, TResult> = Selector<T, Resolution<TResult>> | null | undefined;

export type Reject<TResult> = Selector<any, Resolution<TResult>> | null | undefined;

export interface Then<T, TResult>
{
	(onfulfilled?:Fulfill<T, TResult>, onrejected?:Reject<TResult>):PromiseLike<TResult>;

	(onfulfilled?:Fulfill<T, TResult>, onrejected?:Reject<void>):PromiseLike<TResult>;
}

export interface Executor<T>
{
	(
		resolve:(value?:T | PromiseLike<T>) => void,
		reject:(reason?:any) => void):void;
}

//noinspection JSUnusedGlobalSymbols
export interface Factory
{
	<T>(executor:Executor<T>):PromiseLike<T>;
}

export type Resolver = Selector<Resolution<any>, any> | null | undefined;
