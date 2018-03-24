/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { Executor, Fulfill, Reject } from "./PromiseTypes";
import PromiseBase from "./PromiseBase";
import Promise from "./Promise";
/**
 * A promise that waits for the first then to trigger the resolver.
 */
export default class LazyPromise<T> extends Promise<T> {
    private _resolver;
    constructor(_resolver: Executor<T>);
    protected _onDispose(): void;
    private _onThen();
    thenSynchronous<TResult>(onFulfilled: Fulfill<T, TResult> | undefined | null, onRejected?: Reject<TResult> | undefined | null): PromiseBase<TResult>;
    doneNow(onFulfilled: (v?: T) => any, onRejected?: (v?: any) => any): void;
    /**
     * Will yield for a number of milliseconds from the time called before continuing.
     * @param milliseconds
     * @returns A promise that yields to the current execution and executes after a minimum delay.
     */
    delayFromNow(milliseconds?: number): PromiseBase<T>;
    /**
     * Will yield for a number of milliseconds from after this promise resolves.
     * If the promise is already resolved, the delay will start from now.
     * @param milliseconds
     * @returns A promise that yields to the current execution and executes after a delay.
     */
    delayAfterResolve(milliseconds?: number): PromiseBase<T>;
}
