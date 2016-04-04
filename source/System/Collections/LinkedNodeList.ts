/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="ILinkedListNode.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import * as TextUtility from "../Text/Utility";
import InvalidOperationException from "../Exceptions/InvalidOperationException";
import ArgumentException from "../Exceptions/ArgumentException";
import ArgumentNullException from "../Exceptions/ArgumentNullException";


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
export default
class LinkedNodeList<TNode extends ILinkedNode<TNode>>
implements ILinkedNodeList<TNode>, IDisposable
{

	private _first:TNode;
	private _last:TNode;

	constructor()
	{
		this._first = null;
		this._last = null;
	}


	/**
	 * The first node.  Will be null if the collection is empty.
	 */
	get first():TNode
	{
		return this._first;
	}

	/**
	 * The last node.
	 */
	get last():TNode
	{
		return this._last;
	}


	/**
	 * Iteratively counts the number of linked nodes and returns the value.
	 * @returns {number}
	 */
	get count():number {

		var next = this._first, i:number = 0;
		while(next)
		{
			i++;
			next = next.next;
		}

		return i;
	}

	forEach(
		action:Predicate<TNode> | Action<TNode>):void
	{
		var current:TNode = null,
		    next:TNode = this.first, // Be sure to track the next node so if current node is removed.
		    index:number = 0;

		do {
			current = next;
			next = current && current.next;
		}
		while (current
			&& <any>action(current, index++)!==false);
	}

	/**
	 * Erases the linked node's references to each other and returns the number of nodes.
	 * @returns {number}
	 */
	clear():number
	{
		var _ = this, n:TNode, cF:number = 0, cL:number = 0;

		// First, clear in the forward direction.
		n = _._first;
		_._first = null;

		while(n) {
			cF++;
			let current = n;
			n = n.next;
			current.next = null;
		}

		// Last, clear in the reverse direction.
		n = _._last;
		_._last = null;

		while(n) {
			cL++;
			let current = n;
			n = n.previous;
			current.previous = null;
		}

		if(cF!==cL) console.warn('LinkedNodeList: Forward versus reverse count does not match when clearing. Forward: '+cF+", Reverse: "+cL);

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
		return this.indexOf(node)!=-1;
	}


	/**
	 * Gets the index of a particular node.
	 * @param index
	 */
	getNodeAt(index:number):TNode
	{
		if(index<0)
			return null;

		var next = this._first, i:number = 0;
		while(next && index<i++)
		{
			next = next.next;
		}

		return next;

	}

	/**
	 * Iterates the list to find the specified node and returns its index.
	 * @param node
	 * @returns {boolean}
	 */
	indexOf(node:TNode):number {
		if(node && (node.previous || node.next)) {

			var index = 0;
			var c:TNode, n:TNode = this._first;
			do {
				c = n;
				if(c===node) return index;
				index++;
			} while((n = c && c.next));
		}

		return -1;
	}

	/**
	 * Removes the first node and returns true if successful.
	 * @returns {boolean}
	 */
	removeFirst():boolean
	{
		return this.removeNode(this._first);
	}

	/**
	 * Removes the last node and returns true if successful.
	 * @returns {boolean}
	 */
	removeLast():boolean
	{
		return this.removeNode(this._last);
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

		var _ = this;
		var prev = node.previous, next = node.next, a:boolean = false, b:boolean = false;

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

		return !a && !b;

	}

	/**
	 * Adds a node to the end of the list.
	 * @param node
	 */
	addNode(node:TNode):void {
		this.addNodeAfter(node);
	}


	/**
	 * Inserts a node before the specified 'before' node.
	 * If no 'before' node is specified, it inserts it as the first node.
	 * @param node
	 * @param before
	 */
	addNodeBefore(node:TNode, before?:TNode):void
	{
		assertValidDetached(node);

		var _ = this;

		if(!before) {
			before = _._first;
		}

		if(before) {
			let prev = before.previous;
			node.previous = prev;
			node.next = before;

			before.previous = node;
			if(prev) prev.next = node;
			if(before==_._first) _._last = node;
		} else {
			_._first = _._last = node;
		}
	}

	/**
	 * Inserts a node after the specified 'after' node.
	 * If no 'after' node is specified, it appends it as the last node.
	 * @param node
	 * @param after
	 */
	addNodeAfter(node:TNode, after?:TNode):void
	{
		assertValidDetached(node);

		var _ = this;

		if(!after) {
			after = _._last;
		}

		if(after) {
			let next = after.next;
			node.next = next;
			node.previous = after;

			after.next = node;
			if(next) next.previous = node;
			if(after==_._last) _._last = node;
		} else {
			_._first = _._last = node;
		}
	}

	/**
	 * Takes and existing node and replaces it.
	 * @param node
	 * @param replacement
	 */
	replace(node:TNode, replacement:TNode):void {

		if(node==null)
			throw new ArgumentNullException('node');

		assertValidDetached(replacement,'replacement');

		var _ = this;
		replacement.previous = node.previous;
		replacement.next = node.next;

		if(node.previous) node.previous.next = replacement;
		if(node.next) node.next.previous = replacement;

		if(node==_._first) _._first = replacement;
		if(node==_._last) _._last = replacement;
	}

}

function assertValidDetached<TNode extends ILinkedNode<TNode>>(node:TNode, propName:string = 'node') {

	if(node==null)
		throw new ArgumentNullException(propName);

	if(node.next || node.previous)
		throw new InvalidOperationException("Cannot add a node to a LinkedNodeList that is already linked.");

}