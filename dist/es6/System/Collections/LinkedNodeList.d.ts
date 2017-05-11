/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ILinkedNode, ILinkedNodeWithValue } from "./ILinkedListNode";
import { IEnumerateEach } from "./Enumeration/IEnumerateEach";
import { IDisposable } from "../Disposable/IDisposable";
import { ILinkedNodeList } from "./ILinkedList";
import { IEnumerator } from "./Enumeration/IEnumerator";
import { ActionWithIndex, PredicateWithIndex, Selector, SelectorWithIndex } from "../FunctionTypes";
import { ArrayLikeWritable } from "./Array/ArrayLikeWritable";
/*****************************
 * IMPORTANT NOTES ABOUT PERFORMANCE:
 * http://jsperf.com/simulating-a-queue
 *
 * Adding to an array is very fast, but modifying is slow.
 * LinkedList wins when modifying contents.
 * http://stackoverflow.com/questions/166884/array-versus-linked-list
 *****************************/
/**
 * This class is useful for managing a list of linked nodes, but it does not protect against modifying individual links.
 * If the consumer modifies a link (sets the previous or next value) it will effectively break the collection.
 *
 * It is possible to declare a node type of any kind as long as it contains a previous and next value that can reference another node.
 * Although not as safe as the included LinkedList, this class has less overhead and is more flexible.
 *
 * The count (or length) of this LinkedNodeList is not tracked since it could be corrupted at any time.
 */
export declare class LinkedNodeList<TNode extends ILinkedNode<TNode>> implements ILinkedNodeList<TNode>, IEnumerateEach<TNode>, IDisposable {
    private _first;
    private _last;
    unsafeCount: number;
    constructor();
    private _version;
    assertVersion(version: number): true | never;
    /**
     * The first node.  Will be null if the collection is empty.
     */
    readonly first: TNode | null;
    /**
     * The last node.
     */
    readonly last: TNode | null;
    /**
     * Iteratively counts the number of linked nodes and returns the value.
     * @returns {number}
     */
    readonly count: number;
    forEach(action: ActionWithIndex<TNode>, ignoreVersioning?: boolean): number;
    forEach(action: PredicateWithIndex<TNode>, ignoreVersioning?: boolean): number;
    map<T>(selector: Selector<TNode, T>): T[];
    map<T>(selector: SelectorWithIndex<TNode, T>): T[];
    /**
     * Erases the linked node's references to each other and returns the number of nodes.
     * @returns {number}
     */
    clear(): number;
    /**
     * Clears the list.
     */
    dispose(): void;
    /**
     * Iterates the list to see if a node exists.
     * @param node
     * @returns {boolean}
     */
    contains(node: TNode): boolean;
    /**
     * Gets the index of a particular node.
     * @param index
     */
    getNodeAt(index: number): TNode | null;
    find(condition: PredicateWithIndex<TNode>): TNode | null;
    /**
     * Iterates the list to find the specified node and returns its index.
     * @param node
     * @returns {boolean}
     */
    indexOf(node: TNode): number;
    /**
     * Removes the first node and returns true if successful.
     * @returns {boolean}
     */
    removeFirst(): boolean;
    /**
     * Removes the last node and returns true if successful.
     * @returns {boolean}
     */
    removeLast(): boolean;
    /**
     * Removes the specified node.
     * Returns true if successful and false if not found (already removed).
     * @param node
     * @returns {boolean}
     */
    removeNode(node: TNode): boolean;
    /**
     * Adds a node to the end of the list.
     * @param node
     * @returns {LinkedNodeList}
     */
    addNode(node: TNode): this;
    /**
     * Inserts a node before the specified 'before' node.
     * If no 'before' node is specified, it inserts it as the first node.
     * @param node
     * @param before
     * @returns {LinkedNodeList}
     */
    addNodeBefore(node: TNode, before?: TNode | null): this;
    /**
     * Inserts a node after the specified 'after' node.
     * If no 'after' node is specified, it appends it as the last node.
     * @param node
     * @param after
     * @returns {LinkedNodeList}
     */
    addNodeAfter(node: TNode, after?: TNode | null): this;
    /**
     * Takes and existing node and replaces it.
     * @param node
     * @param replacement
     * @returns {any}
     */
    replace(node: TNode, replacement: TNode): this;
    static valueEnumeratorFrom<T>(list: LinkedNodeList<ILinkedNodeWithValue<T>>): IEnumerator<T>;
    static copyValues<T, TDestination extends ArrayLikeWritable<any>>(list: LinkedNodeList<ILinkedNodeWithValue<T>>, array: TDestination, index?: number): TDestination;
}
export default LinkedNodeList;
