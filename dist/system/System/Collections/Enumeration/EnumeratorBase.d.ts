/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "../../Disposable/DisposableBase";
import { IEnumerator } from "./IEnumerator";
import { IIteratorResult } from "./IIterator";
import { IYield } from "./IYield";
import { Action, Closure } from "../../FunctionTypes";
export declare class EnumeratorBase<T> extends DisposableBase implements IEnumerator<T> {
    private _initializer;
    private _tryGetNext;
    private _yielder;
    private _state;
    private _disposer;
    readonly current: T | undefined;
    readonly index: number;
    constructor(initializer: Closure | null, tryGetNext: (yielder: IYield<T>) => boolean, isEndless?: boolean);
    constructor(initializer: Closure | null, tryGetNext: (yielder: IYield<T>) => boolean, disposer?: Closure | null, isEndless?: boolean);
    protected _isEndless: boolean;
    readonly isEndless: boolean | undefined;
    /**
     * Added for compatibility but only works if the enumerator is active.
     */
    reset(): void;
    private _assertBadState;
    /**
     * Passes the current value to the out callback if the enumerator is active.
     * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
     */
    tryGetCurrent(out: Action<T>): boolean;
    readonly canMoveNext: boolean;
    /**
     * Safely moves to the next entry and returns true if there is one.
     * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
     */
    moveNext(): boolean;
    /**
     * Moves to the next entry and emits the value through the out callback.
     * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
     */
    tryMoveNext(out: Action<T>): boolean;
    nextValue(): T | undefined;
    /**
     * Exposed for compatibility with generators.
     */
    next(): IIteratorResult<T>;
    end(): void;
    'return'(): IIteratorResult<void>;
    'return'<TReturn>(value: TReturn): IIteratorResult<TReturn>;
    private _ensureDisposeState;
    protected _onDispose(): void;
}
export default EnumeratorBase;
