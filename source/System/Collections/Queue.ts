/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://referencesource.microsoft.com/#System/CompMod/system/collections/generic/queue.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="ICollection.d.ts"/>
///<reference path="IList.d.ts"/>
///<reference path="Enumeration/IEnumerateEach.d.ts"/>
///<reference path="../FunctionTypes.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import * as Values from '../Compare';
import * as AU from './Array/Utility';
import Type from '../Types';
import Integer from '../Integer';
import EnumeratorBase from './Enumeration/EnumeratorBase';
import forEach from './Enumeration/forEach';
import NotImplementedException from '../Exceptions/NotImplementedException';
import InvalidOperationException from '../Exceptions/InvalidOperationException';
import ArgumentOutOfRangeException from '../Exceptions/ArgumentOutOfRangeException';

const MINIMUM_GROW:number = 4;
const SHRINK_THRESHOLD:number = 32; // Unused?
// var GROW_FACTOR: number = 200;  // double each time
const GROW_FACTOR_HALF:number = 100;
const DEFAULT_CAPACITY:number = MINIMUM_GROW;
var emptyArray:any[] = [];

export default
class Queue<T> implements ICollection<T>, IEnumerateEach<T>, IDisposable
{

	private _array:T[];
	private _head:number;       // First valid element in the queue
	private _tail:number;       // Last valid element in the queue
	private _size:number;       // Number of elements.
	private _capacity:number;   // Maps to _array.length;
	private _version:number;


	constructor(source?:IEnumerable<T> | IArray<T> | number)
	{
		var _ = this;
		_._head = 0;
		_._tail = 0;
		_._size = 0;
		_._version = 0;

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
				var se = <IEnumerable<T> | IArray<T>> source;
				_._array = AU.initialize<T>(
					Type.isArrayLike(se)
						? se.length
						: DEFAULT_CAPACITY
				);

				forEach<T>(se, (e:T)=> _.enqueue(e));

				_._version = 0;
			}
		}

		_._capacity = _._array.length;
	}

	// #region ICollection<T> implementation

	get count():number
	{
		return this._size;
	}

	get isReadOnly():boolean
	{
		return false;
	}

	add(item:T):void
	{
		this.enqueue(item);
	}


	/**
	 * Clears out the array and returns the number of items that were removed.
	 * @returns {number}
	 */
	clear():number
	{
		var _ = this, array = _._array, head = _._head, tail = _._tail, size = _._size;
		if(head<tail)
			AU.clear(array, head, size);
		else
		{
			AU.clear(array, head, array.length - head);
			AU.clear(array, 0, tail);
		}

		_._head = 0;
		_._tail = 0;
		_._size = 0;
		_._version++;

		_.trimExcess();

		return size;
	}

	/**
	 * Dequeues entries into an array.
	 */
	dump(max:number = Infinity):T[]
	{
		if(Type.isNumber(max, false) && max<0)
			throw new ArgumentOutOfRangeException('max', max, 'must be greater than or equal to 0.');

		var _ = this, result:T[] = [];

		if(isFinite(max))
		{
			Integer.assert(max, 'max');
			while(max-- && _._size)
			{
				result.push(_.dequeue());
			}
		}
		else
		{
			while(_._size)
			{
				result.push(_.dequeue());
			}
		}

		_.trimExcess();

		return result;
	}

	contains(item:T):boolean
	{
		var _ = this;
		var array = _._array, index = _._head, count = _._size, len = _._capacity;

		while(count-->0)
		{
			if(Values.areEqual(array[index], item)) // May need a equality compare here.
				return true;

			index = (index + 1)%len;
		}

		return false;
	}


	copyTo(target:T[], arrayIndex:number = 0):T[]
	{
		if(target==null)
			throw new Error("ArgumentNullException: array cannot be null.");

		assertIntegerZeroOrGreater(arrayIndex, "arrayIndex");

		var _ = this, size = _._size;

		if(!size) return;

		var numToCopy = size,
		    source    = _._array,
		    len       = _._capacity,
		    head      = _._head,
		    lh        = len - head,
		    firstPart
		              = (lh<size)
			    ? lh
			    : size;

		AU.copyTo(source, target, head, arrayIndex, firstPart);
		numToCopy -= firstPart;

		if(numToCopy>0)
			AU.copyTo(source, target, 0, arrayIndex + len - head, numToCopy);

		return target;
	}


	toArray():T[]
	{
		var _ = this, size = _._size;
		var arr:T[] = AU.initialize<T>(size);
		return size ? _.copyTo(arr) : arr;
	}

	remove(item:T):number
	{
		throw new NotImplementedException(
			"ICollection\<T\>.remove is not implemented in Queue\<T\>" +
			" since it would require destroying the underlying array to remove the item."
		);
	}


	// #endregion

	// Results in a complete reset.  Allows for easy cleanup elsewhere.
	dispose():void
	{
		var _ = this;
		_.clear();
		if(_._array!=emptyArray)
		{
			_._array.length = _._capacity = 0;
			_._array = emptyArray;
		}
		_._version = 0;
	}


	forEach(action:Predicate<T> | Action<T>):void
	{
		// Until implementing a changed enumeration mechanism, a copy needs to be used.
		var _ = this, copy = _.toArray(), len = _._size;
		for(let i = 0; i<len; i++)
		{
			if(<any>action(copy[i], i)===false)
				break;
		}
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
		_._version++;
	}

	enqueue(item:T):void
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
		_._version++;
	}

	dequeue(throwIfEmpty:boolean = false):T
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


		if(_._size<_._capacity/2)
		{
			_.trimExcess(SHRINK_THRESHOLD);
		}

		_._version++;
		return removed;
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
				if(version!=_._version)
					throw new InvalidOperationException("Collection was changed during enumeration.");

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
