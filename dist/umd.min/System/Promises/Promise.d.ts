/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Although most of the following code is written from scratch, it is
 * heavily influenced by Q (https://github.com/kriskowal/q) and uses some of Q's spec.
 */
import { DisposableBase } from "../Disposable/DisposableBase";
export declare class PromiseState<T> extends DisposableBase {
    protected _state: Promise.State;
    protected _result: T;
    protected _error: any;
    constructor(_state: Promise.State, _result?: T, _error?: any);
    protected _onDispose(): void;
    protected getState(): Promise.State;
    state: Promise.State;
    isPending: boolean;
    isSettled: boolean;
    isFulfilled: boolean;
    isRejected: boolean;
    protected getResult(): T;
    result: T;
    protected getError(): any;
    error: any;
}
export declare abstract class PromiseBase<T> extends PromiseState<T> implements PromiseLike<T> {
    constructor();
    abstract thenSynchronous<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<TResult>;
    abstract thenThis(onFulfilled: (v?: T) => any, onRejected?: (v?: any) => any): this;
    then<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<TResult>;
    thenAllowFatal<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<TResult>;
    done(onFulfilled: Promise.Fulfill<T, any>, onRejected?: Promise.Reject<any>): void;
    delayFromNow(milliseconds?: number): PromiseBase<T>;
    delayAfterResolve(milliseconds?: number): PromiseBase<T>;
    'catch'<TResult>(onRejected: Promise.Reject<TResult>): PromiseBase<TResult>;
    catchAllowFatal<TResult>(onRejected: Promise.Reject<TResult>): PromiseBase<TResult>;
    'finally'<TResult>(fin: () => Promise.Resolution<TResult>): PromiseBase<TResult>;
    finallyAllowFatal<TResult>(fin: () => Promise.Resolution<TResult>): PromiseBase<TResult>;
    finallyThis(fin: () => void, synchronous?: boolean): this;
}
export declare abstract class Resolvable<T> extends PromiseBase<T> {
    thenSynchronous<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<TResult>;
    thenThis(onFulfilled: (v?: T) => any, onRejected?: (v?: any) => any): this;
}
export declare abstract class Resolved<T> extends Resolvable<T> {
    constructor(state: Promise.State, result: T, error?: any);
}
export declare class Fulfilled<T> extends Resolved<T> {
    constructor(value?: T);
}
export declare class Rejected<T> extends Resolved<T> {
    constructor(error: any);
}
export declare class Promise<T> extends Resolvable<T> {
    private _waiting;
    constructor(resolver?: Promise.Executor<T>, forceSynchronous?: boolean);
    thenSynchronous<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<TResult>;
    thenThis(onFulfilled: (v?: T) => any, onRejected?: (v?: any) => any): this;
    protected _onDispose(): void;
    protected _resolvedCalled: boolean;
    resolveUsing(resolver: Promise.Executor<T>, forceSynchronous?: boolean, throwIfSettled?: boolean): void;
    private _emitDisposalRejection(p);
    private _resolveInternal(result?);
    private _rejectInternal(error);
    resolve(result?: T | PromiseLike<T>, throwIfSettled?: boolean): void;
    reject(error: any, throwIfSettled?: boolean): void;
}
export declare class ArrayPromise<T> extends Promise<T[]> {
    map<U>(transform: (value: T) => U): ArrayPromise<U>;
    reduce<U>(reduction: (previousValue: U, currentValue: T, i?: number, array?: T[]) => U, initialValue?: U): PromiseBase<U>;
    static fulfilled<T>(value: T[]): ArrayPromise<T>;
}
export declare class PromiseCollection<T> extends DisposableBase {
    private _source;
    constructor(source: PromiseLike<T>[]);
    protected _onDispose(): void;
    promises: PromiseLike<T>[];
    all(): ArrayPromise<T>;
    race(): PromiseBase<T>;
    waitAll(): ArrayPromise<PromiseLike<T>>;
    map<U>(transform: (value: T) => U): ArrayPromise<U>;
    pipe<U>(transform: (value: T) => U | PromiseLike<U>): PromiseCollection<U>;
    reduce<U>(reduction: (previousValue: U, currentValue: T, i?: number, array?: PromiseLike<T>[]) => U, initialValue?: U | PromiseLike<U>): PromiseBase<U>;
}
export declare module Promise {
    enum State {
        Pending = 0,
        Fulfilled = 1,
        Rejected = -1,
    }
    type Resolution<TResult> = PromiseLike<TResult> | TResult | void;
    interface Fulfill<T, TResult> {
        (value: T): Resolution<TResult>;
    }
    interface Reject<TResult> {
        (err?: any): Resolution<TResult>;
    }
    interface Then<T, TResult> {
        (onFulfilled: Fulfill<T, TResult>, onRejected?: Reject<TResult>): PromiseLike<TResult>;
    }
    interface Executor<T> {
        (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void): void;
    }
    interface Factory {
        <T>(executor: Executor<T>): PromiseLike<T>;
    }
    function factory<T>(e: Executor<T>): Promise<T>;
    function group<T>(promises: PromiseLike<T>[]): PromiseCollection<T>;
    function group<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): PromiseCollection<T>;
    function all<T>(promises: PromiseLike<T>[]): ArrayPromise<T>;
    function all<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): ArrayPromise<T>;
    function waitAll<T>(promises: PromiseLike<T>[]): ArrayPromise<PromiseLike<T>>;
    function waitAll<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): ArrayPromise<PromiseLike<T>>;
    function race<T>(promises: PromiseLike<T>[]): PromiseBase<T>;
    function race<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): PromiseBase<T>;
    function resolve(): PromiseBase<void>;
    function resolve<T>(value: T | PromiseLike<T>): PromiseBase<T>;
    function using<T>(resolver: Promise.Executor<T>, forceSynchronous?: boolean): PromiseBase<T>;
    function resolveAll<T>(resolutions: Array<T | PromiseLike<T>>): PromiseCollection<T>;
    function resolveAll<T>(promise: T | PromiseLike<T>, ...rest: Array<T | PromiseLike<T>>): PromiseCollection<T>;
    function map<T, U>(source: T[], transform: (value: T) => U): PromiseCollection<U>;
    function reject<T>(reason: T): PromiseBase<T>;
    function wrap<T>(target: T | PromiseLike<T>): PromiseBase<T>;
    function createFrom<T, TResult>(then: Then<T, TResult>): PromiseBase<T>;
}
export default Promise;
