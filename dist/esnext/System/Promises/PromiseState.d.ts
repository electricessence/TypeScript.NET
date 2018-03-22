/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { DisposableBase } from "../Disposable/DisposableBase";
export declare class PromiseState<T> extends DisposableBase {
    protected _state: PromiseStateValue;
    protected _result: T | undefined;
    protected _error: any;
    constructor(_state: PromiseStateValue, _result?: T | undefined, _error?: any);
    protected _onDispose(): void;
    protected getState(): PromiseStateValue;
    readonly state: PromiseStateValue;
    readonly isPending: boolean;
    readonly isSettled: boolean;
    readonly isFulfilled: boolean;
    readonly isRejected: boolean;
    protected getResult(): T | undefined;
    readonly result: T | undefined;
    protected getError(): any;
    readonly error: any;
}
/**
 * The state of a promise.
 * https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md
 * If a promise is disposed the value will be undefined which will also evaluate (promise.state)==false.
 */
export declare enum PromiseStateValue {
    Pending = 0,
    Fulfilled = 1,
    Rejected = -1,
}
export default PromiseState;
