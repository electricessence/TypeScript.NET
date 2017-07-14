/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Although most of the following code is written from scratch, it is
 * heavily influenced by Q (https://github.com/kriskowal/q) and uses some of Q's spec.
 */
import { DisposableBase } from "../Disposable/DisposableBase";
import { Closure } from "../FunctionTypes";
export declare type Resolver = (v: TSDNPromise.Resolution<any>) => any;
export declare class PromiseState<T> extends DisposableBase {
    protected _state: TSDNPromise.State;
    protected _result: T;
    protected _error: any;
    constructor(_state: TSDNPromise.State, _result?: T, _error?: any);
    protected _onDispose(): void;
    protected getState(): TSDNPromise.State;
    readonly state: TSDNPromise.State;
    readonly isPending: boolean;
    readonly isSettled: boolean;
    readonly isFulfilled: boolean;
    readonly isRejected: boolean;
    protected getResult(): T | undefined;
    readonly result: T | undefined;
    protected getError(): any;
    readonly error: any;
}
export declare abstract class PromiseBase<T> extends PromiseState<T> implements PromiseLike<T>, Promise<T> {
    constructor();
    /**
     * .doneNow is provided as a non-standard means that synchronously resolves as the end of a promise chain.
     * As stated by promisejs.org: 'then' is to 'done' as 'map' is to 'forEach'.
     * It is the underlying method by which propagation occurs.
     * @param onFulfilled
     * @param onRejected
     */
    abstract doneNow(onFulfilled: TSDNPromise.Fulfill<T, any> | undefined | null, onRejected?: TSDNPromise.Reject<any> | undefined | null): void;
    abstract doneNow(onFulfilled: (v?: T) => any | undefined | null, onRejected?: (v?: any) => any | undefined | null): void;
    /**
     * Calls the respective handlers once the promise is resolved.
     * @param onFulfilled
     * @param onRejected
     */
    abstract thenSynchronous<TFulfilled = T, TRejected = never>(onFulfilled: TSDNPromise.Fulfill<T, TFulfilled> | undefined | null, onRejected?: TSDNPromise.Reject<TRejected> | undefined | null): PromiseBase<TFulfilled | TRejected>;
    /**
     * Same as 'thenSynchronous' but does not return the result.  Returns the current promise instead.
     * You may not need an additional promise result, and this will not create a new one.
     * @param onFulfilled
     * @param onRejected
     */
    thenThis(onFulfilled: TSDNPromise.Fulfill<T, any> | undefined | null, onRejected?: TSDNPromise.Reject<any> | undefined | null): this;
    /**
     * Standard .then method that defers execution until resolved.
     * @param onFulfilled
     * @param onRejected
     * @returns {TSDNPromise}
     */
    then<TFulfilled = T, TRejected = never>(onFulfilled: TSDNPromise.Fulfill<T, TFulfilled> | undefined | null, onRejected?: TSDNPromise.Reject<TRejected> | undefined | null): PromiseBase<TFulfilled | TRejected>;
    /**
     * Same as .then but doesn't trap errors.  Exceptions may end up being fatal.
     * @param onFulfilled
     * @param onRejected
     * @returns {TSDNPromise}
     */
    thenAllowFatal<TFulfilled = T, TRejected = never>(onFulfilled: TSDNPromise.Fulfill<T, TFulfilled> | undefined | null, onRejected?: TSDNPromise.Reject<TRejected> | undefined | null): PromiseBase<TFulfilled | TRejected>;
    /**
     * .done is provided as a non-standard means that maps to similar functionality in other promise libraries.
     * As stated by promisejs.org: 'then' is to 'done' as 'map' is to 'forEach'.
     * @param onFulfilled
     * @param onRejected
     */
    done(onFulfilled: TSDNPromise.Fulfill<T, any>, onRejected?: TSDNPromise.Reject<any>): void;
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
    'catch'<TResult = never>(onRejected: TSDNPromise.Reject<TResult>): PromiseBase<T | TResult>;
    /**
     * Shortcut for trapping a rejection but will allow exceptions to propagate within the onRejected handler.
     * @param onRejected
     * @returns {PromiseBase<TResult>}
     */
    catchAllowFatal<TResult = never>(onRejected: TSDNPromise.Reject<TResult>): PromiseBase<T | TResult>;
    /**
     * Shortcut to for handling either resolve or reject.
     * @param fin
     * @returns {PromiseBase<TResult>}
     */
    'finally'<TResult = never>(fin: () => TSDNPromise.Resolution<TResult>): PromiseBase<TResult>;
    /**
     * Shortcut to for handling either resolve or reject but will allow exceptions to propagate within the handler.
     * @param fin
     * @returns {PromiseBase<TResult>}
     */
    finallyAllowFatal<TResult = never>(fin: () => TSDNPromise.Resolution<TResult>): PromiseBase<TResult>;
    /**
     * Shortcut to for handling either resolve or reject.  Returns the current promise instead.
     * You may not need an additional promise result, and this will not create a new one.
     * @param fin
     * @param synchronous
     * @returns {PromiseBase}
     */
    finallyThis(fin: Closure, synchronous?: boolean): this;
}
export declare abstract class Resolvable<T> extends PromiseBase<T> {
    doneNow(onFulfilled: (v?: T) => any, onRejected?: (v?: any) => any): void;
    thenSynchronous<TFulfilled = T, TRejected = never>(onFulfilled: TSDNPromise.Fulfill<T, TFulfilled> | undefined | null, onRejected?: TSDNPromise.Reject<TRejected> | undefined | null): PromiseBase<TFulfilled | TRejected>;
}
/**
 * The simplest usable version of a promise which returns synchronously the resolved state provided.
 */
export declare abstract class Resolved<T> extends Resolvable<T> {
    constructor(state: TSDNPromise.State, result: T, error?: any);
}
/**
 * A fulfilled Resolved<T>.  Provided for readability.
 */
export declare class Fulfilled<T> extends Resolved<T> {
    constructor(value: T);
}
/**
 * A rejected Resolved<T>.  Provided for readability.
 */
export declare class Rejected<T> extends Resolved<T> {
    constructor(error: any);
}
/**
 * This promise class that facilitates pending resolution.
 */
export declare class TSDNPromise<T> extends Resolvable<T> {
    private _waiting;
    constructor(resolver?: TSDNPromise.Executor<T>, forceSynchronous?: boolean);
    thenSynchronous<TFulfilled = T, TRejected = never>(onFulfilled: TSDNPromise.Fulfill<T, TFulfilled> | undefined | null, onRejected?: TSDNPromise.Reject<TRejected> | undefined | null): PromiseBase<TFulfilled | TRejected>;
    doneNow(onFulfilled: (v?: T) => any, onRejected?: (v?: any) => any): void;
    protected _onDispose(): void;
    protected _resolvedCalled: boolean;
    resolveUsing(resolver: TSDNPromise.Executor<T>, forceSynchronous?: boolean): void;
    private _emitDisposalRejection(p);
    private _resolveInternal(result?);
    private _rejectInternal(error);
    resolve(result?: T | PromiseLike<T>, throwIfSettled?: boolean): void;
    reject(error: any, throwIfSettled?: boolean): void;
}
/**
 * By providing an ArrayPromise we expose useful methods/shortcuts for dealing with array results.
 */
export declare class ArrayPromise<T> extends TSDNPromise<T[]> {
    /**
     * Simplifies the use of a map function on an array of results when the source is assured to be an array.
     * @param transform
     * @returns {PromiseBase<Array<any>>}
     */
    map<U>(transform: (value: T) => U): ArrayPromise<U>;
    reduce(reduction: (previousValue: T, currentValue: T, i?: number, array?: T[]) => T, initialValue?: T): PromiseBase<T>;
    reduce<U>(reduction: (previousValue: U, currentValue: T, i?: number, array?: T[]) => U, initialValue: U): PromiseBase<U>;
    static fulfilled<T>(value: T[]): ArrayPromise<T>;
}
/**
 * A Promise collection exposes useful methods for handling a collection of promises and their results.
 */
export declare class PromiseCollection<T> extends DisposableBase {
    private _source;
    constructor(source: PromiseLike<T>[] | null | undefined);
    protected _onDispose(): void;
    /**
     * Returns a copy of the source promises.
     * @returns {PromiseLike<PromiseLike<any>>[]}
     */
    readonly promises: PromiseLike<T>[];
    /**
     * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
     * @returns {PromiseBase<any>}
     */
    all(): ArrayPromise<T>;
    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
     * or rejected.
     * @returns {PromiseBase<any>} A new Promise.
     */
    race(): PromiseBase<T>;
    /**
     * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
     * Unlike .all this method waits for all rejections as well as fulfillment.
     * @returns {PromiseBase<PromiseLike<any>[]>}
     */
    waitAll(): ArrayPromise<PromiseLike<T>>;
    /**
     * Waits for all the values to resolve and then applies a transform.
     * @param transform
     * @returns {PromiseBase<Array<any>>}
     */
    map<U>(transform: (value: T) => U): ArrayPromise<U>;
    /**
     * Applies a transform to each promise and defers the result.
     * Unlike map, this doesn't wait for all promises to resolve, ultimately improving the async nature of the request.
     * @param transform
     * @returns {PromiseCollection<U>}
     */
    pipe<U>(transform: (value: T) => U | PromiseLike<U>): PromiseCollection<U>;
    reduce(reduction: (previousValue: T, currentValue: T, i?: number, array?: PromiseLike<T>[]) => T, initialValue?: T | PromiseLike<T>): PromiseBase<T>;
    reduce<U>(reduction: (previousValue: U, currentValue: T, i?: number, array?: PromiseLike<T>[]) => U, initialValue: U | PromiseLike<U>): PromiseBase<U>;
}
export declare module TSDNPromise {
    /**
     * The state of a promise.
     * https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md
     * If a promise is disposed the value will be undefined which will also evaluate (promise.state)==false.
     */
    enum State {
        Pending = 0,
        Fulfilled = 1,
        Rejected = -1,
    }
    type Resolution<TResult> = TResult | PromiseLike<TResult>;
    interface Fulfill<T, TResult> {
        (value: T): Resolution<TResult>;
    }
    interface Reject<TResult> {
        (reason: any): TResult | PromiseLike<TResult>;
    }
    interface Then<T, TResult> {
        (onfulfilled?: Fulfill<T, TResult> | undefined | null, onrejected?: Reject<TResult> | undefined | null): PromiseLike<TResult>;
        (onfulfilled?: Fulfill<T, TResult> | undefined | null, onrejected?: Reject<void> | undefined | null): PromiseLike<TResult>;
    }
    interface Executor<T> {
        (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void): void;
    }
    interface Factory {
        <T>(executor: Executor<T>): PromiseLike<T>;
    }
    function factory<T>(e: Executor<T>): TSDNPromise<T>;
    /**
     * Takes a set of promises and returns a PromiseCollection.
     * @param promises
     */
    function group<T>(promises: PromiseLike<T>[]): PromiseCollection<T>;
    function group<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): PromiseCollection<T>;
    /**
     * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
     */
    function all<T>(promises: PromiseLike<T>[]): ArrayPromise<T>;
    function all<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): ArrayPromise<T>;
    /**
     * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
     * Unlike .all this method waits for all rejections as well as fulfillment.
     */
    function waitAll<T>(promises: PromiseLike<T>[]): ArrayPromise<PromiseLike<T>>;
    function waitAll<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): ArrayPromise<PromiseLike<T>>;
    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
     * or rejected.
     * @param promises An array of Promises.
     * @returns A new Promise.
     */
    function race<T>(promises: PromiseLike<T>[]): PromiseBase<T>;
    function race<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): PromiseBase<T>;
    /**
     * Creates a new resolved promise .
     * @returns A resolved promise.
     */
    function resolve(): PromiseBase<void>;
    /**
     * Creates a new resolved promise for the provided value.
     * @param value A value or promise.
     * @returns A promise whose internal state matches the provided promise.
     */
    function resolve<T>(value: T | PromiseLike<T>): PromiseBase<T>;
    /**
     * Syntactic shortcut for avoiding 'new'.
     * @param resolver
     * @param forceSynchronous
     * @returns {TSDNPromise}
     */
    function using<T>(resolver: TSDNPromise.Executor<T>, forceSynchronous?: boolean): PromiseBase<T>;
    /**
     * Takes a set of values or promises and returns a PromiseCollection.
     * Similar to 'group' but calls resolve on each entry.
     * @param resolutions
     */
    function resolveAll<T>(resolutions: Array<T | PromiseLike<T>>): PromiseCollection<T>;
    function resolveAll<T>(promise: T | PromiseLike<T>, ...rest: Array<T | PromiseLike<T>>): PromiseCollection<T>;
    /**
     * Creates a PromiseCollection containing promises that will resolve on the next tick using the transform function.
     * This utility function does not chain promises together to create the result,
     * it only uses one promise per transform.
     * @param source
     * @param transform
     * @returns {PromiseCollection<T>}
     */
    function map<T, U>(source: T[], transform: (value: T) => U): PromiseCollection<U>;
    /**
     * Creates a new rejected promise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected Promise.
     */
    function reject<T>(reason: T): PromiseBase<T>;
    /**
     * Takes any Promise-Like object and ensures an extended version of it from this module.
     * @param target The Promise-Like object
     * @returns A new target that simply extends the target.
     */
    function wrap<T>(target: T | PromiseLike<T>): PromiseBase<T>;
    /**
     * A function that acts like a 'then' method (aka then-able) can be extended by providing a function that takes an onFulfill and onReject.
     * @param then
     * @returns {PromiseWrapper<T>}
     */
    function createFrom<T>(then: Then<T, any>): PromiseBase<T>;
}
export { TSDNPromise as Promise };
export default TSDNPromise;
