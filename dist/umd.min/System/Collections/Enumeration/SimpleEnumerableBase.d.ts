/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IIteratorResult } from "./IIterator";
import { IEnumerator } from "./IEnumerator";
export declare abstract class SimpleEnumerableBase<T> implements IEnumerator<T> {
    protected _current: T;
    protected _index: number;
    constructor();
    current: T;
    protected abstract canMoveNext(): boolean;
    abstract moveNext(): boolean;
    protected incrementIndex(): number;
    nextValue(): T;
    next(): IIteratorResult<T>;
    'return'(): IIteratorResult<void>;
    'return'<TReturn>(value: TReturn): IIteratorResult<TReturn>;
    reset(): void;
    dispose(): void;
    protected getIsEndless(): boolean;
    isEndless: boolean;
}
export default SimpleEnumerableBase;
