/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * See Readme.md for details.
 */
import { Executor, Fulfill, Reject } from "./PromiseTypes";
import PromiseBase from "./PromiseBase";
import { PromiseStateValue } from "./PromiseState";
export declare function handleSyncIfPossible<T, TFulfilled = T, TRejected = never>(p: PromiseLike<T>, onFulfilled: Fulfill<T, TFulfilled>, onRejected?: Reject<TRejected>): PromiseLike<TFulfilled | TRejected>;
export declare abstract class Resolvable<T> extends PromiseBase<T> {
    doneNow(onFulfilled: Fulfill<T, any>, onRejected?: Reject<any>): void;
    thenSynchronous<TFulfilled = T, TRejected = never>(onFulfilled: Fulfill<T, TFulfilled>, onRejected?: Reject<TRejected>): PromiseBase<TFulfilled | TRejected>;
    protected create<TResult>(resolver?: Executor<TResult>, forceSynchronous?: boolean): PromiseBase<TResult>;
}
/**
 * The simplest usable version of a promise which returns synchronously the resolved state provided.
 */
export declare abstract class Resolved<T> extends Resolvable<T> {
    constructor(state: PromiseStateValue, result: T, error?: any);
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
export declare class Promise<T> extends Resolvable<T> {
    private _waiting;
    constructor(resolver?: Executor<T>, forceSynchronous?: boolean);
    thenSynchronous<TFulfilled = T, TRejected = never>(onFulfilled: Fulfill<T, TFulfilled>, onRejected?: Reject<TRejected>): PromiseBase<TFulfilled | TRejected>;
    doneNow(onFulfilled: Fulfill<T, any>, onRejected?: Reject<any>): void;
    protected _onDispose(): void;
    protected _resolvedCalled: boolean;
    resolveUsing(resolver: Executor<T>, forceSynchronous?: boolean): void;
    private _emitDisposalRejection(p);
    private _resolveInternal(result?);
    private _rejectInternal(error);
    resolve(result?: T | PromiseLike<T>, throwIfSettled?: boolean): void;
    reject(error: any, throwIfSettled?: boolean): void;
}
export default Promise;
