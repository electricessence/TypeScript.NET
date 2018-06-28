/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IIteratorResult } from "./IIterator";
import { IEnumerator } from "./IEnumerator";
import { Action } from "../../FunctionTypes";
export declare abstract class SimpleEnumerableBase<T> implements IEnumerator<T> {
    protected _current: T | undefined;
    protected _index: number;
    protected constructor();
    readonly current: T | undefined;
    protected abstract _canMoveNext(): boolean;
    readonly canMoveNext: boolean;
    abstract moveNext(): boolean;
    tryMoveNext(out: Action<T>): boolean;
    protected incrementIndex(): number;
    nextValue(): T | undefined;
    next(): IIteratorResult<T>;
    end(): void;
    'return'(): IIteratorResult<void>;
    'return'<TReturn>(value: TReturn): IIteratorResult<TReturn>;
    reset(): void;
    dispose(): void;
    protected getIsEndless(): boolean;
    readonly isEndless: boolean | undefined;
}
export default SimpleEnumerableBase;
