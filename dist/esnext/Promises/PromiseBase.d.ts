/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { Closure } from "../FunctionTypes";
import { Executor, Fulfill, Reject, Resolution, Resolver } from "./PromiseTypes";
import PromiseState from "./PromiseState";
export declare function handleDispatch<T, TFulfilled = T, TRejected = never>(p: PromiseLike<T>, onFulfilled: Fulfill<T, TFulfilled>, onRejected?: Reject<TRejected>): void;
export declare function handleResolutionMethods(targetFulfill: Fulfill<any, any>, targetReject: Reject<any>, value: Resolution<any>, resolver?: Resolver): void;
export default abstract class PromiseBase<T> extends PromiseState<T> implements PromiseLike<T> {
    constructor();
    protected abstract create<TResult>(resolver?: Executor<TResult>, forceSynchronous?: boolean): PromiseBase<TResult>;
    /**
     * .doneNow is provided as a non-standard means that synchronously resolves as the end of a promise chain.
     * As stated by promisejs.org: 'then' is to 'done' as 'map' is to 'forEach'.
     * It is the underlying method by which propagation occurs.
     * @param onFulfilled
     * @param onRejected
     */
    abstract doneNow(onFulfilled: Fulfill<T, any>, onRejected?: Reject<any>): void;
    /**
     * Calls the respective handlers once the promise is resolved.
     * @param onFulfilled
     * @param onRejected
     */
    abstract thenSynchronous<TFulfilled = T, TRejected = never>(onFulfilled: Fulfill<T, TFulfilled>, onRejected?: Reject<TRejected>): PromiseBase<TFulfilled | TRejected>;
    /**
     * Same as 'thenSynchronous' but does not return the result.  Returns the current promise instead.
     * You may not need an additional promise result, and this will not create a new one.
     * @param onFulfilled
     * @param onRejected
     */
    thenThis(onFulfilled: Fulfill<T, any>, onRejected?: Reject<any>): this;
    /**
     * Standard .then method that defers execution until resolved.
     * @param onFulfilled
     * @param onRejected
     * @returns {Promise}
     */
    then<TFulfilled = T, TRejected = never>(onFulfilled: Fulfill<T, TFulfilled>, onRejected?: Reject<TRejected>): PromiseBase<TFulfilled | TRejected>;
    /**
     * Same as .then but doesn't trap errors.  Exceptions may end up being fatal.
     * @param onFulfilled
     * @param onRejected
     * @returns {Promise}
     */
    thenAllowFatal<TFulfilled = T, TRejected = never>(onFulfilled: Fulfill<T, TFulfilled>, onRejected?: Reject<TRejected>): PromiseBase<TFulfilled | TRejected>;
    /**
     * .done is provided as a non-standard means that maps to similar functionality in other promise libraries.
     * As stated by promisejs.org: 'then' is to 'done' as 'map' is to 'forEach'.
     * @param onFulfilled
     * @param onRejected
     */
    done(onFulfilled: Fulfill<T, any>, onRejected?: Reject<any>): void;
    /**
     * Will yield for a number of milliseconds from the time called before continuing.
     * @param milliseconds
     * @returns A promise that yields to the current execution and executes after a delay.
     */
    delayFromNow(milliseconds?: number): PromiseBase<T>;
    /**
     * Will yield for a number of milliseconds from after this promise resolves.
     * If the promise is already resolved, the delay will start from now.
     * @param milliseconds
     * @returns A promise that yields to the current execution and executes after a delay.
     */
    delayAfterResolve(milliseconds?: number): PromiseBase<T>;
    /**
     * Shortcut for trapping a rejection.
     * @param onRejected
     * @returns {PromiseBase<TResult>}
     */
    'catch'<TResult = never>(onRejected: Reject<TResult>): PromiseBase<T | TResult>;
    /**
     * Shortcut for trapping a rejection but will allow exceptions to propagate within the onRejected handler.
     * @param onRejected
     * @returns {PromiseBase<TResult>}
     */
    catchAllowFatal<TResult = never>(onRejected: Reject<TResult>): PromiseBase<T | TResult>;
    /**
     * Shortcut to for handling either resolve or reject.
     * @param fin
     * @returns {PromiseBase<TResult>}
     */
    'finally'<TResult = never>(fin: () => Resolution<TResult>): PromiseBase<TResult>;
    /**
     * Shortcut to for handling either resolve or reject but will allow exceptions to propagate within the handler.
     * @param fin
     * @returns {PromiseBase<TResult>}
     */
    finallyAllowFatal<TResult = never>(fin: () => Resolution<TResult>): PromiseBase<TResult>;
    /**
     * Shortcut to for handling either resolve or reject.  Returns the current promise instead.
     * You may not need an additional promise result, and this will not create a new one.
     * @param fin
     * @param synchronous
     * @returns {PromiseBase}
     */
    finallyThis(fin: Closure, synchronous?: boolean): this;
}
