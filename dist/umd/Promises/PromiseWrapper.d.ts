/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { Resolvable } from "./Promise";
import { Fulfill, Reject } from "./PromiseTypes";
import PromiseBase from "./PromiseBase";
/**
 * Provided as a means for extending the interface of other PromiseLike<T> objects.
 */
export default class PromiseWrapper<T> extends Resolvable<T> {
    private _target;
    constructor(_target: PromiseLike<T>);
    thenSynchronous<TFulfilled = T, TRejected = never>(onFulfilled: Fulfill<T, TFulfilled>, onRejected?: Reject<TRejected>): PromiseBase<TFulfilled | TRejected>;
    doneNow(onFulfilled: Fulfill<T, any>, onRejected?: Reject<any>): void;
    protected _onDispose(): void;
}
