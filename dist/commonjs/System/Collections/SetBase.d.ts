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
import { FiniteEnumerableOrArrayLike } from "./IEnumerableOrArray";
import { ISet } from "./ISet";
export declare abstract class SetBase<T> extends CollectionBase<T> implements ISet<T>, IDisposable {
    protected constructor(source?: FiniteEnumerableOrArrayLike<T>);
    protected abstract newUsing(source?: FiniteEnumerableOrArrayLike<T>): SetBase<T>;
    protected _set: LinkedNodeList<ILinkedNodeWithValue<T>> | undefined;
    protected _getSet(): LinkedNodeList<ILinkedNodeWithValue<T>>;
    protected getCount(): number;
    exceptWith(other: FiniteEnumerableOrArrayLike<T>): void;
    intersectWith(other: FiniteEnumerableOrArrayLike<T>): void;
    isProperSubsetOf(other: FiniteEnumerableOrArrayLike<T>): boolean;
    isProperSupersetOf(other: FiniteEnumerableOrArrayLike<T>): boolean;
    isSubsetOf(other: FiniteEnumerableOrArrayLike<T>): boolean;
    isSupersetOf(other: FiniteEnumerableOrArrayLike<T>): boolean;
    overlaps(other: FiniteEnumerableOrArrayLike<T>): boolean;
    setEquals(other: FiniteEnumerableOrArrayLike<T>): boolean;
    symmetricExceptWith(other: FiniteEnumerableOrArrayLike<T>): void;
    unionWith(other: FiniteEnumerableOrArrayLike<T>): void;
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
