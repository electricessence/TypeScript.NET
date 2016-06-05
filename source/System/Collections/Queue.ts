/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://referencesource.microsoft.com/#System/CompMod/system/collections/generic/queue.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {areEqual} from "../Compare";
import * as AU from "./Array/Utility";
import {Type} from "../Types";
import {Integer} from "../Integer";
import {EnumeratorBase} from "./Enumeration/EnumeratorBase";
import {NotImplementedException} from "../Exceptions/NotImplementedException";
import {InvalidOperationException} from "../Exceptions/InvalidOperationException";
import {ArgumentOutOfRangeException} from "../Exceptions/ArgumentOutOfRangeException";
import {CollectionBase} from "./CollectionBase";
import {EqualityComparison, Predicate, Action} from "../FunctionTypes";
import {IEnumerator} from "./Enumeration/IEnumerator";
import {IEnumerableOrArray} from "./IEnumerableOrArray";
import __extendsImport from "../../extends";
const __extends = __extendsImport;

const MINIMUM_GROW:number = 4;
const SHRINK_THRESHOLD:number = 32; // Unused?
// var GROW_FACTOR: number = 200;  // double each time
const GROW_FACTOR_HALF:number = 100;
const DEFAULT_CAPACITY:number = MINIMUM_GROW;
var emptyArray:any[] = [];

export class Queue<T>
extends CollectionBase<T>
{

	private _array:T[];
	private _head:number;       // First valid element in the queue
	private _tail:number;       // Last valid element in the queue
	private _size:number;       // Number of elements.
	private _capacity:number;   // Maps to _array.length;

	constructor(
		source?:IEnumerableOrArray<T> | number,
		equalityComparer:EqualityComparison<T> = areEqual)
	{
		super(null, equalityComparer);
		var _ = this;
		_._head = 0;
		_._tail = 0;
		_._size = 0;

		if(!source)
			_._array = emptyArray;
		else
		{
			if(Type.isNumber(source))
			{
				var capacity = <number>source;
				assertIntegerZeroOrGreater(capacity, "capacity");

				_._array = capacity
					? AU.initialize<T>(capacity)
					: emptyArray;
			}
			else
			{
				var se = <IEnumerableOrArray<T>> source;
				_._array = AU.initialize<T>(
					Type.isArrayLike(se)
						? se.length
						: DEFAULT_CAPACITY
				);

				_._importEntries(se);
			}
		}

		_._capacity = _._array.length;
	}

	protected getCount():number
	{
		return this._size;
	}

	protected _addInternal(item:T):boolean
	{
		var _ = this, array = _._array, size = _._size, len = _._capacity;
		if(size==len)
		{
			var newCapacity = len*GROW_FACTOR_HALF;
			if(newCapacity<len + MINIMUM_GROW)
				newCapacity = len + MINIMUM_GROW;

			_.setCapacity(newCapacity);
			array = _._array;
			len = _._capacity;
		}

		var tail = _._tail;
		array[tail] = item;
		_._tail = (tail + 1)%len;
		_._size = size + 1;
		return true;
	}

	protected _removeInternal(item:T, max?:number):number
	{
		throw new NotImplementedException(
			"ICollection\<T\>.remove is not implemented in Queue\<T\>" +
			" since it would require destroying the underlying array to remove the item."
		);
	}

	protected _clearInternal():number
	{
		var _ = this, array = _._array, head = _._head, tail = _._tail, size = _._size;
		if(head<tail)
			AU.clear(array, head, tail);
		else
		{
			AU.clear(array, head, array.length - head);
			AU.clear(array, 0, tail);
		}

		_._head = 0;
		_._tail = 0;
		_._size = 0;

		_.trimExcess();

		return size;
	}

	protected _onDispose():void
	{
		super._onDispose();
		var _ = this;
		if(_._array!=emptyArray)
		{
			_._array.length = _._capacity = 0;
			_._array = emptyArray;
		}
	}


	/**
	 * Dequeues entries into an array.
	 */
	dump(max:number = Infinity):T[]
	{
		var _ = this, result:T[] = [];

		if(isFinite(max))
		{
			Integer.assertZeroOrGreater(max);
			if(max!==0)
			{
				while(max-- && _._size)
				{
					result.push(_._dequeueInternal());
				}
			}
		}
		else
		{
			while(_._size)
			{
				result.push(_._dequeueInternal());
			}
		}

		_.trimExcess();
		_._signalModification();

		return result;
	}

	forEach(action:Predicate<T> | Action<T>):number
	{
		return super.forEach(action, true);
	}

	setCapacity(capacity:number):void
	{

		assertIntegerZeroOrGreater(capacity, "capacity");

		var _ = this, array = _._array, len = _._capacity;

		if(capacity==len)
			return;

		var head = _._head, tail = _._tail, size = _._size;

		// Special case where we can simply extend the length of the array. (JavaScript only)
		if(array!=emptyArray && capacity>len && head<tail)
		{
			array.length = _._capacity = capacity;
			_._version++;
			return;
		}

		// We create a new array because modifying an existing one could be slow.
		var newArray:T[] = AU.initialize<T>(capacity);
		if(size>0)
		{
			if(head<tail)
			{
				AU.copyTo(array, newArray, head, 0, size);
			}
			else
			{
				AU.copyTo(array, newArray, head, 0, len - head);
				AU.copyTo(array, newArray, 0, len - head, tail);
			}
		}

		_._array = newArray;
		_._capacity = capacity;
		_._head = 0;
		_._tail = (size==capacity) ? 0 : size;

		_._signalModification(true);
	}

	enqueue(item:T):void
	{
		this.add(item);
	}


	protected _dequeueInternal(throwIfEmpty:boolean = false):T
	{
		var _ = this;
		if(_._size==0)
		{
			if(throwIfEmpty)
				throw new InvalidOperationException("Cannot dequeue an empty queue.");
			return void 0;
		}

		var array = _._array, head = _._head;

		var removed = _._array[head];
		array[head] = null;
		_._head = (head + 1)%_._capacity;

		_._size--;

		_._incrementModified();

		return removed;
	}

	dequeue(throwIfEmpty:boolean = false):T
	{
		var _ = this;
		_.assertModifiable();

		// A single dequeue shouldn't need update recursion tracking...
		var modified = !!_._size;
		var v = this._dequeueInternal(throwIfEmpty);

		// This may preemptively trigger the _onModified.
		if(modified && _._size<_._capacity/2)
			_.trimExcess(SHRINK_THRESHOLD);

		_._signalModification();
		return v;
	}


	tryDequeue(out:(value:T)=>void):boolean
	{
		if(!this._size) return false;
		var d = this.dequeue();
		if(out) out(d);
		return true;
	}

	private _getElement(index:number):T
	{
		assertIntegerZeroOrGreater(index, "index");

		var _ = this;
		return _._array[(_._head + index)%_._capacity];
	}

	peek():T
	{
		if(this._size==0)
			throw new InvalidOperationException("Cannot call peek on an empty queue.");

		return this._array[this._head];
	}

	trimExcess(threshold?:number):void
	{
		var _ = this;
		var size = _._size;
		if(size<Math.floor(_._capacity*0.9) && (isNaN(threshold) || threshold<size))
			_.setCapacity(size);
	}

	getEnumerator():IEnumerator<T>
	{
		var _ = this;
		var index:number;
		var version:number;
		return new EnumeratorBase<T>(
			() =>
			{
				version = _._version;
				index = 0;
			},
			(yielder)=>
			{
				_.assertVersion(version);

				if(index==_._size)
					return yielder.yieldBreak();

				return yielder.yieldReturn(_._getElement(index++));
			}
		);
	}
}

function assertZeroOrGreater(value:number, property:string):void
{
	if(value<0)
		throw new ArgumentOutOfRangeException(property, value, "Must be greater than zero");

}

function assertIntegerZeroOrGreater(value:number, property:string):void
{
	Integer.assert(value, property);
	assertZeroOrGreater(value, property);
}

export default Queue;
