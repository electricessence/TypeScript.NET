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
import {IDisposable} from "../Disposable/IDisposable";
import __extendsImport from "../../extends";
const __extends = __extendsImport;

const VOID0:any = void 0;

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

function detachExternal(node:InternalNode<any>):void
{
	if(node)
	{
		var e:any = node.external;
		if(e)
		{
			e._list = VOID0;
			e._nodeInternal = VOID0;
		}
		node.external = VOID0;
	}
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
		const _ = this;
		_._listInternal = new LinkedNodeList<InternalNode<T>>();
		_._importEntries(source);
	}

	protected _onDispose():void
	{
		super._onDispose();
		var l = this._listInternal;
		this._listInternal = null;
		l.dispose();
	}

	protected getCount():number
	{
		var li = this._listInternal;
		return li ? li.unsafeCount : 0;
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
			if(equals(entry, node.value) && _._removeNodeInternal(node))
				removedCount++;

			return removedCount<max;
		});

		return removedCount;
	}

	protected _clearInternal():number
	{
		var list = this._listInternal;
		list.forEach(node=>detachExternal(node));
		return list.clear();
	}


	forEach(
		action:Predicate<T> | Action<T>,
		useCopy:boolean = false):number
	{
		this.throwIfDisposed();
		return useCopy
			? super.forEach(action, useCopy)
			: this._listInternal.forEach((node, i)=>action(node.value, i));
	}

	// #endregion

	// #region IEnumerable<T>
	getEnumerator():IEnumerator<T>
	{
		this.throwIfDisposed();
		return LinkedNodeList.valueEnumeratorFrom<T>(<any>this._listInternal);
	}

	// #endregion

	private _findFirst(entry:T):InternalNode<T>
	{
		//noinspection UnnecessaryLocalVariableJS
		var _      = this,
		    equals = _._equalityComparer,
		    next   = _._listInternal && _._listInternal.first;
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
		    prev   = _._listInternal && _._listInternal.last;
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
		var li = this._listInternal;
		return li && ensureExternal(li.first, this);
	}

	get firstValue():T
	{
		var li = this._listInternal, node = li && li.first;
		return node ? node.value : VOID0;
	}

	get last():ILinkedListNode<T>
	{
		var li = this._listInternal;
		return ensureExternal(li.last, this);
	}

	get lastValue():T
	{
		var li = this._listInternal, node = li && li.last;
		return node ? node.value : VOID0;
	}

	// get methods are available for convenience but is an n*index operation.


	getValueAt(index:number):T
	{
		var li = this._listInternal, node = li && li.getNodeAt(index);
		return node ? node.value : VOID0;
	}

	getNodeAt(index:number):ILinkedListNode<T>
	{
		var li = this._listInternal;
		return li && ensureExternal(li.getNodeAt(index), this);
	}

	find(entry:T):ILinkedListNode<T>
	{
		var li = this._listInternal;
		return li && ensureExternal(this._findFirst(entry), this);
	}

	findLast(entry:T):ILinkedListNode<T>
	{
		var li = this._listInternal;
		return li && ensureExternal(this._findLast(entry), this);
	}

	addFirst(entry:T):void
	{
		this.assertModifiable();
		this._listInternal.addNodeBefore(new InternalNode(entry));
		this._signalModification(true);
	}

	addLast(entry:T):void
	{
		this.add(entry);
	}

	private _removeNodeInternal(node:InternalNode<T>):boolean
	{
		const _ = this;
		if(node && _._listInternal.removeNode(node))
		{
			detachExternal(node);
			_._signalModification(true);
			return true;
		}
		return false;
	}

	removeFirst():boolean
	{
		const _ = this;
		_.assertModifiable();
		return _._removeNodeInternal(_._listInternal.first);
	}

	removeLast():boolean
	{
		const _ = this;
		_.assertModifiable();
		return _._removeNodeInternal(_._listInternal.last);
	}

	removeAt(index:number):boolean
	{
		const _ = this;
		_.assertModifiable();
		return _._removeNodeInternal(_._listInternal.getNodeAt(index));
	}

	// Returns true if successful and false if not found (already removed).
	removeNode(node:ILinkedListNode<T>):boolean
	{
		const _ = this;
		_.assertModifiable();
		return _._removeNodeInternal(getInternal(node, _));
	}

	addBefore(before:ILinkedListNode<T>, entry:T):void
	{
		const _ = this;
		_.assertModifiable();
		_._listInternal.addNodeBefore(
			new InternalNode(entry),
			getInternal(before, _)
		);

		_._signalModification(true);
	}

	addAfter(after:ILinkedListNode<T>, entry:T):void
	{
		const _ = this;
		_.assertModifiable();
		_._listInternal.addNodeAfter(
			new InternalNode(entry),
			getInternal(after, _)
		);

		_._signalModification(true);
	}

}

// Use an internal node class to prevent mucking up the LinkedList.
class LinkedListNode<T> implements ILinkedListNode<T>, IDisposable
{
	constructor(
		private _list:LinkedList<T>,
		private _nodeInternal:InternalNode<T>)
	{
	}

	private throwIfDetached():void
	{
		if(!this._list)
			throw new Error("This node has been detached from its list and is no longer valid.");
	}

	get list():LinkedList<T>
	{
		return this._list;
	}

	get previous():ILinkedListNode<T>
	{
		this.throwIfDetached();
		return ensureExternal(this._nodeInternal.previous, this._list);
	}

	get next():ILinkedListNode<T>
	{
		this.throwIfDetached();
		return ensureExternal(this._nodeInternal.next, this._list);
	}

	get value():T
	{
		this.throwIfDetached();
		return this._nodeInternal.value;
	}

	set value(v:T)
	{
		this.throwIfDetached();
		this._nodeInternal.value = v;
	}

	addBefore(entry:T):void
	{
		this.throwIfDetached();
		this._list.addBefore(this, entry);
	}

	addAfter(entry:T):void
	{
		this.throwIfDetached();
		this._list.addAfter(this, entry);
	}


	remove():void
	{
		var list = this._list;
		if(list) list.removeNode(this);
		this._list = VOID0;
		this._nodeInternal = VOID0;
	}

	dispose():void
	{
		this.remove();
	}

}

export default LinkedList;
