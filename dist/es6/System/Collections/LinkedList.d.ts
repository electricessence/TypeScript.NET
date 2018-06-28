/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { CollectionBase } from "./CollectionBase";
import { ILinkedListNode } from "./ILinkedListNode";
import { IEnumerator } from "./Enumeration/IEnumerator";
import { ActionWithIndex, EqualityComparison, PredicateWithIndex } from "../FunctionTypes";
import { ILinkedList } from "./ILinkedList";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
export declare class LinkedList<T> extends CollectionBase<T> implements ILinkedList<T> {
    private readonly _listInternal;
    constructor(source?: IEnumerableOrArray<T>, equalityComparer?: EqualityComparison<T>);
    protected assertVersion(version: number): true | never;
    protected _onDispose(): void;
    protected getCount(): number;
    protected _addInternal(entry: T): boolean;
    protected _removeInternal(entry: T, max?: number): number;
    protected _clearInternal(): number;
    forEach(action: ActionWithIndex<T>, useCopy?: boolean): number;
    forEach(action: PredicateWithIndex<T>, useCopy?: boolean): number;
    getEnumerator(): IEnumerator<T>;
    private _findFirst;
    private _findLast;
    removeOnce(entry: T): boolean;
    readonly first: ILinkedListNode<T> | null;
    readonly firstValue: T | undefined;
    readonly last: ILinkedListNode<T> | null;
    readonly lastValue: T | undefined;
    getValueAt(index: number): T | undefined;
    getNodeAt(index: number): ILinkedListNode<T> | null;
    find(entry: T): ILinkedListNode<T> | null;
    findLast(entry: T): ILinkedListNode<T> | null;
    addFirst(entry: T): this;
    addLast(entry: T): this;
    private _removeNodeInternal;
    removeFirst(): boolean;
    removeLast(): boolean;
    removeAt(index: number): boolean;
    removeNode(node: ILinkedListNode<T>): boolean;
    addBefore(before: ILinkedListNode<T>, entry: T): this;
    addAfter(after: ILinkedListNode<T>, entry: T): this;
}
export default LinkedList;
