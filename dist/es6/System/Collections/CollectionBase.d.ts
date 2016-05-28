/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "../Disposable/DisposableBase";
import { ICollection } from "./ICollection";
import { IEnumerator } from "./Enumeration/IEnumerator";
import { IEnumerateEach } from "./Enumeration/IEnumerateEach";
import { EqualityComparison, Predicate, Action } from "../FunctionTypes";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
import { IArray } from "./Array/IArray";
import { ILinqEnumerable } from "../../System.Linq/Enumerable";
export declare abstract class CollectionBase<T> extends DisposableBase implements ICollection<T>, IEnumerateEach<T> {
    protected _equalityComparer: EqualityComparison<T>;
    constructor(source?: IEnumerableOrArray<T>, _equalityComparer?: EqualityComparison<T>);
    protected abstract getCount(): number;
    count: number;
    protected getIsReadOnly(): boolean;
    isReadOnly: boolean;
    protected assertModifiable(): void;
    protected _version: number;
    assertVersion(version: number): void;
    private _modifiedCount;
    private _updateRecursion;
    protected _onModified(): void;
    protected _signalModification(increment?: boolean): boolean;
    protected _incrementModified(): void;
    isUpdating: boolean;
    handleUpdate(closure?: () => boolean): boolean;
    protected abstract _addInternal(entry: T): boolean;
    add(entry: T): void;
    protected abstract _removeInternal(entry: T, max?: number): number;
    remove(entry: T, max?: number): number;
    protected abstract _clearInternal(): number;
    clear(): number;
    protected _onDispose(): void;
    protected _importEntries(entries: IEnumerableOrArray<T>): number;
    importEntries(entries: IEnumerableOrArray<T>): number;
    abstract getEnumerator(): IEnumerator<T>;
    contains(entry: T): boolean;
    forEach(action: Predicate<T> | Action<T>, useCopy?: boolean): number;
    copyTo<TTarget extends IArray<T>>(target: TTarget, index?: number): TTarget;
    toArray(): T[];
    private _linq;
    linq: ILinqEnumerable<T>;
}
