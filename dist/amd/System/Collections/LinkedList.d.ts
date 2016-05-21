/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { CollectionBase } from "./CollectionBase";
import { ILinkedListNode } from "./ILinkedListNode";
import { IEnumerator } from "./Enumeration/IEnumerator";
import { Predicate, Action, EqualityComparison } from "../FunctionTypes";
import { ILinkedList } from "./ILinkedList";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
export declare class LinkedList<T> extends CollectionBase<T> implements ILinkedList<T> {
    private _listInternal;
    constructor(source?: IEnumerableOrArray<T>, equalityComparer?: EqualityComparison<T>);
    protected getCount(): number;
    protected _addInternal(entry: T): boolean;
    protected _removeInternal(entry: T, max?: number): number;
    protected _clearInternal(): number;
    forEach(action: Predicate<T> | Action<T>, useCopy?: boolean): number;
    getEnumerator(): IEnumerator<T>;
    private _findFirst(entry);
    private _findLast(entry);
    removeOnce(entry: T): boolean;
    first: ILinkedListNode<T>;
    last: ILinkedListNode<T>;
    getValueAt(index: number): T;
    getNodeAt(index: number): ILinkedListNode<T>;
    find(entry: T): ILinkedListNode<T>;
    findLast(entry: T): ILinkedListNode<T>;
    addFirst(entry: T): void;
    addLast(entry: T): void;
    removeFirst(): void;
    removeLast(): void;
    removeNode(node: ILinkedListNode<T>): boolean;
    addBefore(before: ILinkedListNode<T>, entry: T): void;
    addAfter(after: ILinkedListNode<T>, entry: T): void;
    addNodeBefore(node: ILinkedListNode<T>, before: ILinkedListNode<T>): void;
    addNodeAfter(node: ILinkedListNode<T>, after: ILinkedListNode<T>): void;
}
export default LinkedList;
