/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { LinkedNodeList } from "./LinkedNodeList";
import { CollectionBase } from "./CollectionBase";
import { IDisposable } from "../Disposable/IDisposable";
import { ILinkedNodeWithValue } from "./ILinkedListNode";
import { ActionWithIndex, PredicateWithIndex } from "../FunctionTypes";
import { IEnumerator } from "./Enumeration/IEnumerator";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
import { ISet } from "./ISet";
export declare abstract class SetBase<T> extends CollectionBase<T> implements ISet<T>, IDisposable {
    protected constructor(source?: IEnumerableOrArray<T>);
    protected abstract newUsing(source?: IEnumerableOrArray<T>): SetBase<T>;
    protected _set: LinkedNodeList<ILinkedNodeWithValue<T>> | undefined;
    protected _getSet(): LinkedNodeList<ILinkedNodeWithValue<T>>;
    protected getCount(): number;
    exceptWith(other: IEnumerableOrArray<T>): void;
    intersectWith(other: IEnumerableOrArray<T>): void;
    isProperSubsetOf(other: IEnumerableOrArray<T>): boolean;
    isProperSupersetOf(other: IEnumerableOrArray<T>): boolean;
    isSubsetOf(other: IEnumerableOrArray<T>): boolean;
    isSupersetOf(other: IEnumerableOrArray<T>): boolean;
    overlaps(other: IEnumerableOrArray<T>): boolean;
    setEquals(other: IEnumerableOrArray<T>): boolean;
    symmetricExceptWith(other: IEnumerableOrArray<T>): void;
    unionWith(other: IEnumerableOrArray<T>): void;
    protected _clearInternal(): number;
    protected _onDispose(): void;
    protected abstract _getNode(item: T): ILinkedNodeWithValue<T> | undefined;
    contains(item: T): boolean;
    getEnumerator(): IEnumerator<T>;
    forEach(action: ActionWithIndex<T>, useCopy?: boolean): number;
    forEach(action: PredicateWithIndex<T>, useCopy?: boolean): number;
    protected _removeNode(node: ILinkedNodeWithValue<T> | null | undefined): boolean;
    removeFirst(): boolean;
    removeLast(): boolean;
}
export default SetBase;
