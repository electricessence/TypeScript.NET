/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { CollectionBase } from "./CollectionBase";
import { Predicate, Action, EqualityComparison } from "../FunctionTypes";
import { IEnumerator } from "./Enumeration/IEnumerator";
import { IList } from "./IList";
import { IEnumerateEach } from "./Enumeration/IEnumerateEach";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
import { IArray } from "./Array/IArray";
export declare class List<T> extends CollectionBase<T> implements IList<T>, IEnumerateEach<T> {
    protected _source: T[];
    constructor(source?: IEnumerableOrArray<T>, equalityComparer?: EqualityComparison<T>);
    protected getCount(): number;
    protected _addInternal(entry: T): boolean;
    protected _removeInternal(entry: T, max?: number): number;
    protected _clearInternal(): number;
    protected _importEntries(entries: IEnumerableOrArray<T>): number;
    get(index: number): T;
    set(index: number, value: T): boolean;
    indexOf(item: T): number;
    insert(index: number, value: T): void;
    removeAt(index: number): boolean;
    contains(item: T): boolean;
    copyTo<TTarget extends IArray<any>>(target: TTarget, index?: number): TTarget;
    getEnumerator(): IEnumerator<T>;
    forEach(action: Predicate<T> | Action<T>, useCopy?: boolean): number;
}
export default List;
