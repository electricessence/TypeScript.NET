/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

export type Resolution<TResult> = PromiseLike<TResult>|TResult;


export interface Fulfill<T, TResult>
{
	(value:T | PromiseLike<T>):Resolution<TResult>
}
export interface Reject<TResult>
{
	(err?:any):(Resolution<TResult>|void)
}
export interface Then<T, TResult>
{
	(resolve:Fulfill<T, TResult>, reject?:Reject<TResult>):PromiseLike<TResult>
}
