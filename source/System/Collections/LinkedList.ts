/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="ILinkedListNode.d.ts"/>
///<reference path="ILinkedList.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import * as Values from "../Compare";
import * as ArrayUtility from "../Collections/Array/Utility";
import * as Enumerator from "./Enumeration/Enumerator";
import EnumeratorBase from "./Enumeration/EnumeratorBase";
import LinkedNodeList from "./LinkedNodeList";
import InvalidOperationException from "../Exceptions/InvalidOperationException";
import ArgumentNullException from "../Exceptions/ArgumentNullException";


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

	var external:ILinkedListNode<T> = node.external;
	if(!external)
		node.external = external = new LinkedListNode<T>(list, node);

	return external;
}

function getInternal<T>(node:ILinkedListNode<T>, list:LinkedList<T>):InternalNode<T>
{
	if(!node)
		throw new ArgumentNullException(
			"Cannot be null.");

	if(node.list!=list)
		throw new InvalidOperationException(
			"Provided node does not belong to this list.");

	var n:InternalNode<T> = (<any>node)._nodeInternal;
	if(!n)
		throw new InvalidOperationException(
			"Provided node is not valid.");

	return n;
}

export default
class LinkedList<T>
implements ILinkedList<T>
{
	private _listInternal:LinkedNodeList<InternalNode<T>>;
	private _count:number;

	constructor(source?:IEnumerable<T>);
	constructor(source?:IArray<T>);
	constructor(source:any)
	{
		var _ = this, c = 0;
		var e = Enumerator.from<T>(source);

		var list = _._listInternal = new LinkedNodeList<InternalNode<T>>();

		while(e.moveNext())
		{
			list.addNode( new InternalNode<T>(e.current) );
			++c;
		}

		_._count = c;
	}


	// #region IEnumerateEach<T>
	forEach(
		action:Predicate<T> | Action<T>,
		useCopy:boolean = false):void
	{
		if(useCopy)
		{
			var array = this.toArray();
			ArrayUtility.forEach(array, action);
			array.length = 0;
		}
		else
		{
			this._listInternal.forEach((node, i)=>action(node.value, i));
		}
	}

	// #endregion

	// #region IEnumerable<T>
	getEnumerator():IEnumerator<T>
	{
		var _ = this,
		    current:InternalNode<T>,
		    next:InternalNode<T>;

		return new EnumeratorBase<T>(
			() =>
			{
				// Initialize anchor...
				current = null;
				next = _._listInternal.first;
			},
			(yielder)=>
			{

				if(next)
				{
					current = next;
					next = current && current.next;
					return yielder.yieldReturn(current.value);
				}

				return yielder.yieldBreak();
			}
		);
	}

	// #endregion

	private _findFirst(entry:T):InternalNode<T>
	{
		var equals = Values.areEqual,
		    next   = this._listInternal.first;
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
		var equals = Values.areEqual,
		    prev   = this._listInternal.last;
		while(prev)
		{
			if(equals(entry, prev.value))
				return prev;
			prev = prev.previous;
		}
		return null;
	}

	// #region ICollection<T>
	get count():number
	{
		return this._count;
	}

	//noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
	get isReadOnly():boolean
	{
		return false;
	}

	add(entry:T):void
	{
		this._listInternal.addNode(new InternalNode(entry));
		this._count++;
	}


	clear():number
	{
		this._count = 0;
		return this._listInternal.clear();
	}


	contains(entry:T):boolean
	{
		var found:boolean = false, equals = Values.areEqual;
		this.forEach(e => !(found = equals(entry, e)));
		return found;
	}

	copyTo(array:T[], index:number = 0):T[]
	{
		if(!array) throw new ArgumentNullException('array');

		if(this._listInternal.first)
		{
			var minLength = index + this._count;
			if(array.length<minLength) array.length = minLength; // Preset the length if need be.
			this.forEach(
				(entry, i) =>
				{
					array[index + i] = entry;
				}
			);
		}

		return array;
	}

	toArray():T[]
	{
		var array = ArrayUtility.initialize<T>(this._count);
		return this.copyTo(array);
	}

	removeOnce(entry:T):boolean
	{
		return this.remove(entry, 1)!==0;
	}

	remove(entry:T, max:number = Infinity):number
	{
		var equals = Values.areEqual;
		var _ = this, list = _._listInternal, removedCount:number = 0;

		list.forEach(node=>
		{
			if(equals(entry, node.value) && list.removeNode(node))
			{
				--_._count;
				++removedCount;
			}
			return removedCount<max;
		});

		return removedCount;

	}

	// #endregion


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
		return this._listInternal.getNodeAt(index).value;
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
		++this._count;
	}

	addLast(entry:T):void
	{
		this.add(entry);
	}

	removeFirst():void
	{
		var _ = this, first = _._listInternal.first;
		if(first && _._listInternal.removeNode(first)) {
			_._count--;
		}
	}

	removeLast():void
	{
		var _ = this, last = _._listInternal.last;
		if(last && _._listInternal.removeNode(last)) {
			--_._count;
		}
	}

	// Returns true if successful and false if not found (already removed).
	removeNode(node:ILinkedListNode<T>):boolean
	{
		var _ = this,
		    removed = _._listInternal.removeNode(getInternal(node, _));

		if(removed) --_._count;

		return removed;
	}

	addBefore(before:ILinkedListNode<T>, entry:T):void
	{
		this._listInternal.addNodeBefore(
			new InternalNode(entry),
			getInternal(before, this)
		);
		++this._count;
	}


	addAfter(after:ILinkedListNode<T>, entry:T):void
	{
		this._listInternal.addNodeAfter(
			new InternalNode(entry),
			getInternal(after, this)
		);
		++this._count;
	}

	addNodeBefore(node:ILinkedListNode<T>, before:ILinkedListNode<T>):void
	{
		this._listInternal.addNodeBefore(
			getInternal(before, this),
			getInternal(node, this)
		);
		++this._count;
	}

	addNodeAfter(node:ILinkedListNode<T>, after:ILinkedListNode<T>):void
	{
		this._listInternal.addNodeAfter(
			getInternal(after, this),
			getInternal(node, this)
		);
		++this._count;
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

