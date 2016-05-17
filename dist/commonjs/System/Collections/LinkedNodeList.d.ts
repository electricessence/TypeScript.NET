/// <reference path="../../../../source/System/Collections/ILinkedListNode.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export default class LinkedNodeList<TNode extends ILinkedNode<TNode>> implements ILinkedNodeList<TNode>, IEnumerateEach<TNode>, IDisposable {
    private _first;
    private _last;
    unsafeCount: number;
    constructor();
    first: TNode;
    last: TNode;
    count: number;
    forEach(action: Predicate<TNode> | Action<TNode>): void;
    map<T>(selector: Selector<TNode, T>): T[];
    clear(): number;
    dispose(): void;
    contains(node: TNode): boolean;
    getNodeAt(index: number): TNode;
    find(condition: Predicate<TNode>): TNode;
    indexOf(node: TNode): number;
    removeFirst(): boolean;
    removeLast(): boolean;
    removeNode(node: TNode): boolean;
    addNode(node: TNode): void;
    addNodeBefore(node: TNode, before?: TNode): void;
    addNodeAfter(node: TNode, after?: TNode): void;
    replace(node: TNode, replacement: TNode): void;
    static valueEnumeratorFrom<T>(list: LinkedNodeList<ILinkedNodeWithValue<T>>): IEnumerator<T>;
    static copyValues<T, TDestination extends IArray<any>>(list: LinkedNodeList<ILinkedNodeWithValue<T>>, array: TDestination, index?: number): TDestination;
}
