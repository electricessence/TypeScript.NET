/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {areEqual} from "../Compare";
import {LinkedNodeList} from "./LinkedNodeList";
import {InvalidOperationException} from "../Exceptions/InvalidOperationException";
import {ArgumentNullException} from "../Exceptions/ArgumentNullException";
import {CollectionBase} from "./CollectionBase";
import {ILinkedListNode, ILinkedNode, INodeWithValue} from "./ILinkedListNode";
import {IEnumerator} from "./Enumeration/IEnumerator";
import {Predicate, Action, EqualityComparison} from "../FunctionTypes";
import {ILinkedList} from "./ILinkedList";
import {IEnumerableOrArray} from "./IEnumerableOrArray";
import __extendsImport from "../../extends";
const __extends = __extendsImport;

/*****************************
 * IMPORTANT NOTES ABOUT PERFORMANCE:
 * http://jsperf.com/simulating-a-queue
 *
 * Adding to an array is very fast, but modifying is slow.
 * LinkedList wins when modifying contents.
 * http://stackoverflow.com/questions/166884/array-versus-linked-list
 *****************************/

/*
 * An internal node is used to manage the order without exposing underlying link chain to the consumer.
 */
class InternalNode<T>
implements ILinkedNode<InternalNode<T>>, INodeWithValue<T>
{
	constructor(
		public value?:T,
		public previous?:InternalNode<T>,
		public next?:InternalNode<T>)
	{
	}

	external:ILinkedListNode<T>;

	assertDetached():void
	{
		if(this.next || this.previous)
			throw new InvalidOperationException(
				"Adding a node that is already placed.");
	}

}

function ensureExternal<T>(node:InternalNode<T>, list:LinkedList<T>):ILinkedListNode<T>
{
	if(!node)
		return null;
	if(!list)
		throw new ArgumentNullException("list");

	var external:ILinkedListNode<T> = node.external;
	if(!external)
		node.external = external = new LinkedListNode<T>(list, node);

	return external;
}

function getInternal<T>(node:ILinkedListNode<T>, list:LinkedList<T>):InternalNode<T>
{
	if(!node)
		throw new ArgumentNullException("node");
	if(!list)
		throw new ArgumentNullException("list");

	if(node.list!=list)
		throw new InvalidOperationException(
			"Provided node does not belong to this list.");

	var n:InternalNode<T> = (<any>node)._nodeInternal;
	if(!n)
		throw new InvalidOperationException(
			"Provided node is not valid.");

	return n;
}

export class LinkedList<T>
extends CollectionBase<T> implements ILinkedList<T>
{
	private _listInternal:LinkedNodeList<InternalNode<T>>;

	constructor(
		source?:IEnumerableOrArray<T>,
		equalityComparer:EqualityComparison<T> = areEqual)
	{
		super(null, equalityComparer);
		var _ = this;
		_._listInternal = new LinkedNodeList<InternalNode<T>>();
		_._importEntries(source);
	}

	protected getCount():number
	{
		return this._listInternal.unsafeCount;
	}

	protected _addInternal(entry:T):boolean
	{
		this._listInternal.addNode(new InternalNode(entry));
		return true;
	}

	protected _removeInternal(entry:T, max:number = Infinity):number
	{
		var _            = this,
		    equals       = _._equalityComparer,
		    list         = _._listInternal,
		    removedCount = 0;

		list.forEach(node=>
		{
			if(equals(entry, node.value) && list.removeNode(node))
				removedCount++;

			return removedCount<max;
		});

		return removedCount;
	}

	protected _clearInternal():number
	{
		return this._listInternal.clear();
	}


	forEach(
		action:Predicate<T> | Action<T>,
		useCopy:boolean = false):number
	{
		return useCopy
			? super.forEach(action, useCopy)
			: this._listInternal.forEach((node, i)=>action(node.value, i));
	}

	// #endregion

	// #region IEnumerable<T>
	getEnumerator():IEnumerator<T>
	{
		return LinkedNodeList.valueEnumeratorFrom<T>(<any>this._listInternal);
	}

	// #endregion

	private _findFirst(entry:T):InternalNode<T>
	{
		//noinspection UnnecessaryLocalVariableJS
		var _      = this,
		    equals = _._equalityComparer,
		    next   = _._listInternal.first;
		while(next)
		{
			if(equals(entry, next.value))
				return next;
			next = next.next;
		}
		return null;
	}

	private _findLast(entry:T):InternalNode<T>
	{
		//noinspection UnnecessaryLocalVariableJS
		var _      = this,
		    equals = _._equalityComparer,
		    prev   = _._listInternal.last;
		while(prev)
		{
			if(equals(entry, prev.value))
				return prev;
			prev = prev.previous;
		}
		return null;
	}

	removeOnce(entry:T):boolean
	{
		return this.remove(entry, 1)!==0;
	}

	get first():ILinkedListNode<T>
	{
		return ensureExternal(this._listInternal.first, this);
	}

	get last():ILinkedListNode<T>
	{
		return ensureExternal(this._listInternal.last, this);
	}

	// get methods are available for convenience but is an n*index operation.


	getValueAt(index:number):T
	{
		var node = this._listInternal.getNodeAt(index);
		if(!node)
			return node && node.value || void(0);
	}

	getNodeAt(index:number):ILinkedListNode<T>
	{
		return ensureExternal(this._listInternal.getNodeAt(index), this);
	}

	find(entry:T):ILinkedListNode<T>
	{
		return ensureExternal(this._findFirst(entry), this);
	}

	findLast(entry:T):ILinkedListNode<T>
	{
		return ensureExternal(this._findLast(entry), this);
	}

	addFirst(entry:T):void
	{
		this._listInternal.addNodeBefore(new InternalNode(entry));
		this._signalModification(true);
	}

	addLast(entry:T):void
	{
		this.add(entry);
	}

	removeFirst():void
	{
		var _ = this, first = _._listInternal.first;
		if(first && _._listInternal.removeNode(first))
			_._signalModification(true);
	}

	removeLast():void
	{
		var _ = this, last = _._listInternal.last;
		if(last && _._listInternal.removeNode(last))
			_._signalModification(true);
	}

	// Returns true if successful and false if not found (already removed).
	removeNode(node:ILinkedListNode<T>):boolean
	{
		var _ = this;

		if(_._listInternal.removeNode(getInternal(node, _)))
		{
			_._signalModification(true);
			return true;
		}

		return false;
	}

	addBefore(before:ILinkedListNode<T>, entry:T):void
	{
		var _ = this;
		_._listInternal.addNodeBefore(
			new InternalNode(entry),
			getInternal(before, _)
		);

		_._signalModification(true);
	}

	addAfter(after:ILinkedListNode<T>, entry:T):void
	{
		var _ = this;
		_._listInternal.addNodeAfter(
			new InternalNode(entry),
			getInternal(after, _)
		);

		_._signalModification(true);
	}

	addNodeBefore(node:ILinkedListNode<T>, before:ILinkedListNode<T>):void
	{
		var _ = this;
		_._listInternal.addNodeBefore(
			getInternal(before, _),
			getInternal(node, _)
		);

		_._signalModification(true);
	}

	addNodeAfter(node:ILinkedListNode<T>, after:ILinkedListNode<T>):void
	{
		var _ = this;
		this._listInternal.addNodeAfter(
			getInternal(after, _),
			getInternal(node, _)
		);

		_._signalModification(true);
	}


}

// Use an internal node class to prevent mucking up the LinkedList.
class LinkedListNode<T> implements ILinkedListNode<T>
{
	constructor(
		private _list:LinkedList<T>,
		private _nodeInternal:InternalNode<T>)
	{
	}

	get list():LinkedList<T>
	{
		return this._list;
	}

	get previous():ILinkedListNode<T>
	{
		return ensureExternal(this._nodeInternal.previous, this._list);
	}

	get next():ILinkedListNode<T>
	{
		return ensureExternal(this._nodeInternal.next, this._list);
	}

	get value():T
	{
		return this._nodeInternal.value;
	}

	set value(v:T)
	{
		this._nodeInternal.value = v;
	}

	addBefore(entry:T):void
	{
		this._list.addBefore(this, entry);
	}

	addAfter(entry:T):void
	{
		this._list.addAfter(this, entry);
	}

	addNodeBefore(before:ILinkedListNode<T>):void
	{
		this._list.addNodeBefore(this, before);
	}

	addNodeAfter(after:ILinkedListNode<T>):void
	{
		this._list.addNodeAfter(this, after);
	}

	remove():void
	{
		this._list.removeNode(this);
	}

}

export default LinkedList;
