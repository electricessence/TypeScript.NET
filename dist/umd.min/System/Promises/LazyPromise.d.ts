/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { Promise, PromiseBase } from "./Promise";
export declare class LazyPromise<T> extends Promise<T> {
    private _resolver;
    constructor(_resolver: Promise.Executor<T>);
    protected _onDispose(): void;
    private _onThen();
    thenSynchronous<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<TResult>;
    thenThis(onFulfilled: (v?: T) => any, onRejected?: (v?: any) => any): PromiseBase<T>;
    delayFromNow(milliseconds?: number): PromiseBase<T>;
    delayAfterResolve(milliseconds?: number): PromiseBase<T>;
}
export default LazyPromise;
