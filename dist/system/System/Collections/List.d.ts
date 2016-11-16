import { CollectionBase } from "./CollectionBase";
import { EqualityComparison, ActionWithIndex, PredicateWithIndex } from "../FunctionTypes";
import { IEnumerator } from "./Enumeration/IEnumerator";
import { IList } from "./IList";
import { IEnumerateEach } from "./Enumeration/IEnumerateEach";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
import { IArray } from "./Array/IArray";
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
    copyTo<TTarget extends IArray<any>>(target: TTarget, index?: number): TTarget;
    getEnumerator(): IEnumerator<T>;
    forEach(action: ActionWithIndex<T>, useCopy?: boolean): number;
    forEach(action: PredicateWithIndex<T>, useCopy?: boolean): number;
}
export default List;
