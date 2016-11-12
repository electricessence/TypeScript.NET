/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ILinkedNode, ILinkedNodeWithValue } from "./ILinkedListNode";
import { IEnumerateEach } from "./Enumeration/IEnumerateEach";
import { IDisposable } from "../Disposable/IDisposable";
import { ILinkedNodeList } from "./ILinkedList";
import { IEnumerator } from "./Enumeration/IEnumerator";
import { Predicate, Selector, PredicateWithIndex, ActionWithIndex, SelectorWithIndex } from "../FunctionTypes";
import { IArray } from "./Array/IArray";
export declare class LinkedNodeList<TNode extends ILinkedNode<TNode>> implements ILinkedNodeList<TNode>, IEnumerateEach<TNode>, IDisposable {
    private _first;
    private _last;
    unsafeCount: number;
    constructor();
    private _version;
    assertVersion(version: number): void;
    readonly first: TNode | null;
    readonly last: TNode | null;
    readonly count: number;
    forEach(action: ActionWithIndex<TNode>, ignoreVersioning?: boolean): number;
    forEach(action: PredicateWithIndex<TNode>, ignoreVersioning?: boolean): number;
    map<T>(selector: Selector<TNode, T>): T[];
    map<T>(selector: SelectorWithIndex<TNode, T>): T[];
    clear(): number;
    dispose(): void;
    contains(node: TNode): boolean;
    getNodeAt(index: number): TNode | null;
    find(condition: Predicate<TNode>): TNode | null;
    find(condition: PredicateWithIndex<TNode>): TNode | null;
    indexOf(node: TNode): number;
    removeFirst(): boolean;
    removeLast(): boolean;
    removeNode(node: TNode): boolean;
    addNode(node: TNode): void;
    addNodeBefore(node: TNode, before?: TNode | null): void;
    addNodeAfter(node: TNode, after?: TNode | null): void;
    replace(node: TNode, replacement: TNode): void;
    static valueEnumeratorFrom<T>(list: LinkedNodeList<ILinkedNodeWithValue<T>>): IEnumerator<T>;
    static copyValues<T, TDestination extends IArray<any>>(list: LinkedNodeList<ILinkedNodeWithValue<T>>, array: TDestination, index?: number): TDestination;
}
export default LinkedNodeList;
