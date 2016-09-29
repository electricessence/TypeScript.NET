/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "../../Disposable/DisposableBase";
import { IEnumerator } from "./IEnumerator";
import { IIteratorResult } from "./IIterator";
import { IYield } from "./IYield";
import { Closure } from "../../FunctionTypes";
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
    moveNext(): boolean;
    nextValue(): T;
    next(): IIteratorResult<T>;
    'return'(): IIteratorResult<void>;
    'return'<TReturn>(value: TReturn): IIteratorResult<TReturn>;
    protected _onDispose(): void;
}
export default EnumeratorBase;
