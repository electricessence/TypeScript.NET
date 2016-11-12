/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "../../Disposable/DisposableBase";
import { IEnumerator } from "./IEnumerator";
import { IIteratorResult } from "./IIterator";
import { IYield } from "./IYield";
import { Closure, Action } from "../../FunctionTypes";
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
    reset(): void;
    private _assertBadState();
    tryGetCurrent(out: Action<T>): boolean;
    readonly canMoveNext: boolean;
    moveNext(): boolean;
    tryMoveNext(out: Action<T>): boolean;
    nextValue(): T | undefined;
    next(): IIteratorResult<T>;
    end(): void;
    'return'(): IIteratorResult<void>;
    'return'<TReturn>(value: TReturn): IIteratorResult<TReturn>;
    private _ensureDisposeState(state);
    protected _onDispose(): void;
}
export default EnumeratorBase;
