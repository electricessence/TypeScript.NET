/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { CollectionBase } from "./CollectionBase";
import { ActionWithIndex, EqualityComparison, PredicateWithIndex } from "../FunctionTypes";
import { IEnumerator } from "./Enumeration/IEnumerator";
import { IList } from "./IList";
import { IEnumerateEach } from "./Enumeration/IEnumerateEach";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
import { ArrayLikeWritable } from "./Array/ArrayLikeWritable";
export declare class List<T> extends CollectionBase<T> implements IList<T>, IEnumerateEach<T> {
    protected readonly _source: T[];
    constructor(source?: IEnumerableOrArray<T>, equalityComparer?: EqualityComparison<T>);
    protected _onDispose(): void;
    protected getCount(): number;
    protected _addInternal(entry: T): boolean;
    protected _removeInternal(entry: T, max?: number): number;
    protected _clearInternal(): number;
    protected _importEntries(entries: IEnumerableOrArray<T> | null | undefined): number;
    get(index: number): T;
    set(index: number, value: T): boolean;
    indexOf(item: T): number;
    insert(index: number, value: T): void;
    removeAt(index: number): boolean;
    contains(item: T): boolean;
    copyTo<TTarget extends ArrayLikeWritable<any>>(target: TTarget, index?: number): TTarget;
    getEnumerator(): IEnumerator<T>;
    /**
     * Sorts the underlying array.
     * @param compareFn The name of the function used to determine the order of the elements. If omitted, the elements are sorted in ascending, ASCII character order.
     */
    sort(compareFn?: (a: T, b: T) => number): this;
    forEach(action: ActionWithIndex<T>, useCopy?: boolean): number;
    forEach(action: PredicateWithIndex<T>, useCopy?: boolean): number;
}
export default List;
