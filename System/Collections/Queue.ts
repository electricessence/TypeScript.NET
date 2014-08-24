///<reference path="ArrayUtility.ts"/>

/*
* @author electricessence / https://github.com/electricessence/
* Based Upon: http://referencesource.microsoft.com/#System/compmod/system/collections/generic/queue.cs
* Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
*/

module System.Collections
{
	var MINIMUMGROW: number = 4 | 0;
	// var SHRINKTHRESHOLD: number = 32 | 0; // Unused?
	// var GROWFACTOR: number = 200 | 0;  // double each time
	var GROWFACTOR_HALF: number = 100 | 0;
	var DEFAULTCAPACITY: number = MINIMUMGROW;
	var emptyArray: any[] = [];

	function assertInteger(value: number, property: string): void
	{
		if (value != Math.floor(value))
			throw new Error("InvalidOperationException: " + property+" must be an interger.");

	}

	function assertZeroOrGreater(value: number, property: string): void
	{
		if (value < 0)
			throw new Error("ArgumentOutOfRangeException: " + property +" must be greater than zero");

	}

	function assertIntegerZeroOrGreater(value: number, property: string): void
	{
		assertInteger(value, property);
		assertZeroOrGreater(value, property);
	}

	export class Queue<T> implements ICollection<T> {
		
		private _array: T[];
		private _head: number;       // First valid element in the queue
		private _tail: number;       // Last valid element in the queue
		private _size: number;       // Number of elements.
        private _version: number;


		constructor(source: IEnumerable<T>);
		constructor(source: IArray<T>);
		constructor(capacity: number);
		constructor(source?:any)
		{
			var _ = this;
			_._head = 0;
			_._tail = 0;
			_._size = 0;
			_._version = 0;

			if (!source)
				_._array = emptyArray;
			else
			{
				if (System.Types.isNumber(source))
				{
					assertIntegerZeroOrGreater(source, "source");

					_._array = source
						? ArrayUtility.initialize<T>(source)
						: emptyArray;
				}
				else
				{
					_._array = ArrayUtility.initialize<T>(
						source instanceof Array || "length" in source
						? source.length
						: DEFAULTCAPACITY);

					Enumerable.forEach<T>(source, e=> _.enqueue(e));

					_._version = 0;
				}
			}
				
		}

		// #region ICollection<T> implementation

		get count(): number
		{
			return this._size;
		}

		get isReadOnly(): boolean
		{
			return false;
		}

		add(item: T): void
		{
			this.enqueue(item);
		}


		clear(): number
		{
			var _ = this, array = _._array, head = _._head, tail = _._tail, size = _._size;
			if (head < tail)
				ArrayUtility.clear(array, head, size);
			else
			{
				ArrayUtility.clear(array, head, array.length - head);
				ArrayUtility.clear(array, 0, tail);
			}

			_._head = 0;
			_._tail = 0;
			_._size = 0;
			_._version++;

			return size;
		}

		contains(item: T): boolean
		{
			var _ = this;
			var array = _._array, index = _._head, count = _._size, len = array.length;

			while (count-- > 0)
			{
				if (System.areEqual(array[index], item)) // May need a equality compare here.
					return true;

				index = (index + 1) % len;
			}

			return false;
		}


		copyTo(target:T[], arrayIndex:number = 0):void
        {
			if (target == null)
				throw new Error("ArgumentNullException: array cannot be null.");

			assertIntegerZeroOrGreater(arrayIndex, "arrayIndex");

			var arrayLen = target.length, _ = this, size = _._size;
    
            var numToCopy = (arrayLen - arrayIndex < size) ? (arrayLen - arrayIndex) : size;
			if (numToCopy == 0) return;

			var source = _._array, len = source.length, head = _._head, lh = len - head;
			var firstPart = (lh < numToCopy) ? lh : numToCopy;

			ArrayUtility.copyTo(source, target, head, arrayIndex, firstPart);
			numToCopy -= firstPart;

			if (numToCopy > 0)
				ArrayUtility.copyTo(source, target, 0, arrayIndex + source.length - head, numToCopy);
		}

		remove(item: T): number
		{
			throw new Error(
				"ICollection<T>.remove is not implemented in Queue<T> since it would require destroying the underlying array to remove the item.");
		}


		// #endregion

		toArray(): T[]
		{
			var _ = this, size = _._size;
			var arr: T[] = ArrayUtility.initialize<T>(size);
			if (size == 0)
				return arr;

			_.copyTo(arr);

			return arr;
		}

		setCapacity(capacity:number):void {

			assertIntegerZeroOrGreater(capacity, "capacity");

			var _ = this, array = _._array, len = array.length;

			if (capacity == len)
				return;

			var head = _._head, tail = _._tail, size = _._size;

			// Special case where we can simplly extend the length of the array. (JavaScript only)
			if (array!=emptyArray && capacity > len && head < tail)
			{
				array.length = capacity;
				_._version++;
				return;
			}

			// We create a new array because modifying an existing one could be slow.
			var newarray: T[] = ArrayUtility.initialize<T>(capacity);
			if (size > 0)
			{
				if (head < tail)
				{
					ArrayUtility.copyTo(array, newarray, head, 0, size);
				} else
				{
					ArrayUtility.copyTo(array, newarray, head, 0, len - head);
					ArrayUtility.copyTo(array, newarray, 0, len - head, tail);
				}
			}

			_._array = newarray;
			_._head = 0;
			_._tail = (size == capacity) ? 0 : size;
			_._version++;
		}

		enqueue(item: T): void
		{
			var _ = this, array = _._array, size = _._size | 0, len = array.length | 0;
			if (size == len)
			{
				var newcapacity = len * GROWFACTOR_HALF;
				if (newcapacity < len + MINIMUMGROW)
					newcapacity = len + MINIMUMGROW;

				_.setCapacity(newcapacity);
				array = _._array;
				len = array.length;
			}

			var tail = _._tail;
			array[tail] = item;
			_._tail = (tail + 1) % len;
			_._size = size + 1;
			_._version++;
		}

		dequeue(): T
		{
			var _ = this;
			if (_._size == 0)
				throw new Error("InvalidOperatioException: cannot call peek on an empty queue.");

			var array = _._array, head = _._head;

            var removed = _._array[head];
			array[head] = null;
			_._head = (head + 1) % array.length;

			_._size--;
			_._version++;
			return removed;
        }

		private _getElement(index:number):T
		{
			assertIntegerZeroOrGreater(index, "index");

			var _ = this;
			return _._array[(_._head + index) % _._array.length];
		}

		peek():T {
			if (this._size == 0)
				throw new Error("InvalidOperatioException: cannot call peek on an empty queue.");

			return this._array[this._head];
		}

		trimExcess(): void
		{
			var _ = this;
			var size = _._size;
			if (size < Math.floor(_._array.length * 0.9))
				_.setCapacity(size);
		}

		getEnumerator(): IEnumerator<T>
		{
			var _ = this;
			var index: number;
			var version: number;
			return new EnumeratorBase<T>(
				() =>
				{
					version = _._version;
					index = 0;
				},
				yieler =>
				{
					if (version != _._version)
						throw new Error("InvalidOperationException: collection was changed during enumeration.");

					if (index == _._size)
						return yieler.yieldBreak();

					return yieler.yieldReturn(_._getElement(index++));
				});
		}

	}

}