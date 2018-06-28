import { CollectionBase } from "./CollectionBase";
import { Action, ActionWithIndex, EqualityComparison, PredicateWithIndex } from "../FunctionTypes";
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
    /**
     * Dequeues entries into an array.
     */
    dump(max?: number): T[];
    forEach(action: ActionWithIndex<T>): number;
    forEach(action: PredicateWithIndex<T>): number;
    setCapacity(capacity: number): this;
    enqueue(item: T): this;
    protected _tryDequeueInternal(out: Action<T>): boolean;
    /**
     * Pulls an entry from the head of the queue and returns it.
     * Returns undefined if the queue is already empty.
     */
    dequeue(): T | undefined;
    /**
     * Pulls an entry from the head of the queue and returns it.
     * Returns undefined if the queue is already empty and throwIfEmpty is false.
     * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
     * @param throwIfEmpty
     */
    dequeue(throwIfEmpty: true): T;
    /**
     * Pulls an entry from the head of the queue and returns it.
     * Returns undefined if the queue is already empty and throwIfEmpty is false.
     * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
     * @param throwIfEmpty
     */
    dequeue(throwIfEmpty: boolean): T | undefined;
    /**
     * Checks to see if the queue has entries an pulls an entry from the head of the queue and passes it to the out handler.
     * @param out The 'out' handler that receives the value if it exists.
     * @returns {boolean} True if a value was retrieved.  False if not.
     */
    tryDequeue(out: Action<T>): boolean;
    private _getElement;
    /**
     * Returns the entry at the head of the queue.
     * Returns undefined if the queue is already empty.
     */
    peek(): T | undefined;
    /**
     * Returns the entry at the head of the queue.
     * Returns undefined if the queue is already empty and throwIfEmpty is false.
     * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
     * @param throwIfEmpty
     */
    peek(throwIfEmpty: true): T;
    /**
     * Returns the entry at the head of the queue.
     * Returns undefined if the queue is already empty and throwIfEmpty is false.
     * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
     * @param throwIfEmpty
     */
    peek(throwIfEmpty: boolean): T | undefined;
    trimExcess(threshold?: number): void;
    getEnumerator(): IEnumerator<T>;
}
export default Queue;
