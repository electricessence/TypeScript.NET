/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as TextUtility from "../Text/Utility";
import {InvalidOperationException} from "../Exceptions/InvalidOperationException";
import {ArgumentException} from "../Exceptions/ArgumentException";
import {ArgumentNullException} from "../Exceptions/ArgumentNullException";
import {EnumeratorBase} from "./Enumeration/EnumeratorBase";
import {ILinkedNode, ILinkedNodeWithValue} from "./ILinkedListNode";
import {IEnumerateEach} from "./Enumeration/IEnumerateEach";
import {IDisposable} from "../Disposable/IDisposable";
import {ILinkedNodeList} from "./ILinkedList";
import {IEnumerator} from "./Enumeration/IEnumerator";
import {Selector, PredicateWithIndex, ActionWithIndex, SelectorWithIndex} from "../FunctionTypes";
import {IArray} from "./Array/IArray";
import __extendsImport from "../../extends";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;


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
export class LinkedNodeList<TNode extends ILinkedNode<TNode>>
implements ILinkedNodeList<TNode>, IEnumerateEach<TNode>, IDisposable
{

	private _first:TNode|null;
	private _last:TNode|null;
	unsafeCount:number;

	constructor()
	{
		this._first = null;
		this._last = null;
		this.unsafeCount = 0;
		this._version = 0;
	}

	private _version:number;

	assertVersion(version:number):true|never
	{
		if(version!==this._version)
			throw new InvalidOperationException("Collection was modified.");
		return true;
	}

	/**
	 * The first node.  Will be null if the collection is empty.
	 */
	get first():TNode|null
	{
		return this._first;
	}

	/**
	 * The last node.
	 */
	get last():TNode|null
	{
		return this._last;
	}


	/**
	 * Iteratively counts the number of linked nodes and returns the value.
	 * @returns {number}
	 */
	get count():number
	{

		let next:TNode|null|undefined = this._first;

		let i:number = 0;
		while(next)
		{
			i++;
			next = next.next;
		}

		return i;
	}

	// Note, no need for 'useCopy' since this avoids any modification conflict.
	// If iterating over a copy is necessary, a copy should be made manually.
	forEach(
		action:ActionWithIndex<TNode>, ignoreVersioning?:boolean):number
	forEach(
		action:PredicateWithIndex<TNode>, ignoreVersioning?:boolean):number
	forEach(
		action:ActionWithIndex<TNode> | PredicateWithIndex<TNode>, ignoreVersioning?:boolean):number
	{
		const _ = this;
		let current:TNode|null|undefined = null,
		    next:TNode|null|undefined = _.first; // Be sure to track the next node so if current node is removed.

		const version = _._version;
		let index:number = 0;
		do {
			if(!ignoreVersioning) _.assertVersion(version);
			current = next;
			next = current && current.next;
		}
		while(current
		&& <any>action(current, index++)!==false);

		return index;
	}

	map<T>(selector:Selector<TNode,T>):T[]
	map<T>(selector:SelectorWithIndex<TNode,T>):T[]
	map<T>(selector:SelectorWithIndex<TNode,T>):T[]
	{
		if(!selector) throw new ArgumentNullException('selector');

		const result:T[] = [];
		this.forEach((node, i)=>
		{
			result.push(selector(node, i));
		});
		return result;
	}

	/**
	 * Erases the linked node's references to each other and returns the number of nodes.
	 * @returns {number}
	 */
	clear():number
	{
		const _ = this;
		let n:TNode|null|undefined, cF:number = 0, cL:number = 0;

		// First, clear in the forward direction.
		n = _._first;
		_._first = null;

		while(n)
		{
			cF++;
			let current = n;
			n = n.next;
			current.next = null;
		}

		// Last, clear in the reverse direction.
		n = _._last;
		_._last = null;

		while(n)
		{
			cL++;
			let current = n;
			n = n.previous;
			current.previous = null;
		}

		if(cF!==cL) console.warn('LinkedNodeList: Forward versus reverse count does not match when clearing. Forward: ' + cF + ", Reverse: " + cL);

		_._version++;
		_.unsafeCount = 0;

		return cF;
	}

	/**
	 * Clears the list.
	 */
	dispose():void
	{
		this.clear();
	}

	/**
	 * Iterates the list to see if a node exists.
	 * @param node
	 * @returns {boolean}
	 */
	contains(node:TNode):boolean
	{
		return this.indexOf(node)!= -1;
	}


	/**
	 * Gets the index of a particular node.
	 * @param index
	 */
	getNodeAt(index:number):TNode|null
	{
		if(index<0)
			return null;

		let next = this._first;

		let i:number = 0;
		while(next && i++<index)
		{
			next = next.next || null;
		}

		return next;

	}

	find(condition:PredicateWithIndex<TNode>):TNode|null
	{
		let node:TNode|null = null;
		this.forEach((n, i)=>
		{
			if(condition(n, i))
			{
				node = n;
				return false;
			}
		});
		return node;
	}

	/**
	 * Iterates the list to find the specified node and returns its index.
	 * @param node
	 * @returns {boolean}
	 */
	indexOf(node:TNode):number
	{
		if(node && (node.previous || node.next))
		{

			let index = 0;
			let c:TNode|null|undefined,
			    n:TNode|null|undefined = this._first;

			do {
				c = n;
				if(c===node) return index;
				index++;
			}
			while((n = c && c.next));
		}

		return -1;
	}

	/**
	 * Removes the first node and returns true if successful.
	 * @returns {boolean}
	 */
	removeFirst():boolean
	{
		return !!this._first && this.removeNode(this._first);
	}

	/**
	 * Removes the last node and returns true if successful.
	 * @returns {boolean}
	 */
	removeLast():boolean
	{
		return !!this._last && this.removeNode(this._last);
	}


	/**
	 * Removes the specified node.
	 * Returns true if successful and false if not found (already removed).
	 * @param node
	 * @returns {boolean}
	 */
	removeNode(node:TNode):boolean
	{
		if(node==null)
			throw new ArgumentNullException('node');

		const _ = this;
		const prev:TNode|null = node.previous || null,
		      next:TNode|null = node.next || null;

		let a:boolean = false,
		    b:boolean = false;

		if(prev) prev.next = next;
		else if(_._first==node) _._first = next;
		else a = true;

		if(next) next.previous = prev;
		else if(_._last==node) _._last = prev;
		else b = true;

		if(a!==b)
		{
			throw new ArgumentException(
				'node', TextUtility.format(
					"Provided node is has no {0} reference but is not the {1} node!",
					a ? "previous" : "next", a ? "first" : "last"
				)
			);
		}

		const removed = !a && !b;
		if(removed)
		{
			_._version++;
			_.unsafeCount--;
			node.previous = null;
			node.next = null;
		}
		return removed;

	}

	/**
	 * Adds a node to the end of the list.
	 * @param node
	 */
	addNode(node:TNode):void
	{
		this.addNodeAfter(node);
	}


	/**
	 * Inserts a node before the specified 'before' node.
	 * If no 'before' node is specified, it inserts it as the first node.
	 * @param node
	 * @param before
	 */
	addNodeBefore(node:TNode, before:TNode|null = null):void
	{
		assertValidDetached(node);

		const _ = this;

		if(!before)
		{
			before = _._first;
		}

		if(before)
		{
			let prev = before.previous;
			node.previous = prev;
			node.next = before;

			before.previous = node;
			if(prev) prev.next = node;
			if(before==_._first) _._first = node;
		}
		else
		{
			_._first = _._last = node;
		}

		_._version++;
		_.unsafeCount++;
	}

	/**
	 * Inserts a node after the specified 'after' node.
	 * If no 'after' node is specified, it appends it as the last node.
	 * @param node
	 * @param after
	 */
	addNodeAfter(node:TNode, after:TNode|null = null):void
	{
		assertValidDetached(node);
		const _ = this;

		if(!after)
		{
			after = _._last;
		}

		if(after)
		{
			let next = after.next;
			node.next = next;
			node.previous = after;

			after.next = node;
			if(next) next.previous = node;
			if(after==_._last) _._last = node;
		}
		else
		{
			_._first = _._last = node;
		}

		_._version++;
		_.unsafeCount++;

	}

	/**
	 * Takes and existing node and replaces it.
	 * @param node
	 * @param replacement
	 */
	replace(node:TNode, replacement:TNode):void
	{

		if(node==null)
			throw new ArgumentNullException('node');

		if(node==replacement) return;

		assertValidDetached(replacement, 'replacement');

		const _ = this;
		replacement.previous = node.previous;
		replacement.next = node.next;

		if(node.previous) node.previous.next = replacement;
		if(node.next) node.next.previous = replacement;

		if(node==_._first) _._first = replacement;
		if(node==_._last) _._last = replacement;

		_._version++;
	}

	static valueEnumeratorFrom<T>(list:LinkedNodeList<ILinkedNodeWithValue<T>>):IEnumerator<T>
	{

		if(!list) throw new ArgumentNullException('list');

		let current:ILinkedNodeWithValue<T>|null|undefined,
		    next:ILinkedNodeWithValue<T>|null|undefined,
		    version:number;

		return new EnumeratorBase<T>(
			() =>
			{
				// Initialize anchor...
				current = null;
				next = list.first;
				version = list._version;
			},
			(yielder)=>
			{
				if(next)
				{
					list.assertVersion(version);

					current = next;
					next = current && current.next;
					return yielder.yieldReturn(current.value);
				}

				return yielder.yieldBreak();
			}
		);
	}

	static copyValues<T,TDestination extends IArray<any>>(
		list:LinkedNodeList<ILinkedNodeWithValue<T>>,
		array:TDestination,
		index:number = 0):TDestination
	{
		if(list && list.first)
		{
			if(!array) throw new ArgumentNullException('array');

			list.forEach(
				(node, i) =>
				{
					array[index + i] = node.value;
				}
			);
		}

		return array;
	}

}

function assertValidDetached<TNode extends ILinkedNode<TNode>>(
	node:TNode,
	propName:string = 'node')
{

	if(node==null)
		throw new ArgumentNullException(propName);

	if(node.next || node.previous)
		throw new InvalidOperationException("Cannot add a node to a LinkedNodeList that is already linked.");

}

export default LinkedNodeList;