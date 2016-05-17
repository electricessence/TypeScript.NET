/// <reference path="../../../../../source/System/Disposable/IDisposable.d.ts" />
/// <reference path="../../../../../source/System/Collections/Enumeration/IEnumerator.d.ts" />
/// <reference path="../../../../../source/System/Collections/Enumeration/IYield.d.ts" />
/// <reference path="../../../../../source/System/Collections/Enumeration/IIterator.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import DisposableBase from "../../Disposable/DisposableBase";
export default class EnumeratorBase<T> extends DisposableBase implements IEnumerator<T> {
    private _initializer;
    private _tryGetNext;
    private _yielder;
    private _state;
    private _disposer;
    current: T;
    constructor(initializer: () => void, tryGetNext: (yielder: IYield<T>) => boolean, isEndless?: boolean);
    constructor(initializer: () => void, tryGetNext: (yielder: IYield<T>) => boolean, disposer?: () => void, isEndless?: boolean);
    protected _isEndless: boolean;
    isEndless: boolean;
    reset(): void;
    moveNext(): boolean;
    nextValue(): T;
    next(): IIteratorResult<T>;
    protected _onDispose(): void;
}
