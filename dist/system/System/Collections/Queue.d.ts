/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://referencesource.microsoft.com/#System/CompMod/system/collections/generic/queue.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { CollectionBase } from "./CollectionBase";
import { EqualityComparison, Predicate, Action } from "../FunctionTypes";
import { IEnumerator } from "./Enumeration/IEnumerator";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
export declare class Queue<T> extends CollectionBase<T> {
    private _array;
    private _head;
    private _tail;
    private _size;
    private _capacity;
    constructor(source?: IEnumerableOrArray<T> | number, equalityComparer?: EqualityComparison<T>);
    protected getCount(): number;
    protected _addInternal(item: T): boolean;
    protected _removeInternal(item: T, max?: number): number;
    protected _clearInternal(): number;
    protected _onDispose(): void;
    dump(max?: number): T[];
    forEach(action: Predicate<T> | Action<T>): number;
    setCapacity(capacity: number): void;
    enqueue(item: T): void;
    protected _dequeueInternal(throwIfEmpty?: boolean): T;
    dequeue(throwIfEmpty?: boolean): T;
    tryDequeue(out: (value: T) => void): boolean;
    private _getElement(index);
    peek(): T;
    trimExcess(threshold?: number): void;
    getEnumerator(): IEnumerator<T>;
}
export default Queue;
