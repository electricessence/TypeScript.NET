/*
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://referencesource.microsoft.com/#System/CompMod/system/collections/generic/queue.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports", '../System', '../Types', './Arrays/Utility', './Enumeration/EnumeratorBase', './Enumeration/Enumerable'], function (require, exports, System, Types, ArrayUtility, EnumeratorBase, Enumerable) {
    var MINIMUM_GROW = 4 | 0;
    var GROW_FACTOR_HALF = 100 | 0;
    var DEFAULT_CAPACITY = MINIMUM_GROW;
    var emptyArray = [];
    var Queue = (function () {
        function Queue(source) {
            var _ = this;
            _._head = 0;
            _._tail = 0;
            _._size = 0;
            _._version = 0;
            if (!source)
                _._array = emptyArray;
            else {
                if (Types.isNumber(source)) {
                    assertIntegerZeroOrGreater(source, "source");
                    _._array = source
                        ? ArrayUtility.initialize(source)
                        : emptyArray;
                }
                else {
                    _._array = ArrayUtility.initialize(source instanceof Array || "length" in source
                        ? source.length
                        : DEFAULT_CAPACITY);
                    Enumerable.forEach(source, function (e) { return _.enqueue(e); });
                    _._version = 0;
                }
            }
            _._capacity = _._array.length;
        }
        Object.defineProperty(Queue.prototype, "count", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Queue.prototype, "isReadOnly", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Queue.prototype.add = function (item) {
            this.enqueue(item);
        };
        Queue.prototype.clear = function () {
            var _ = this, array = _._array, head = _._head, tail = _._tail, size = _._size;
            if (head < tail)
                ArrayUtility.clear(array, head, size);
            else {
                ArrayUtility.clear(array, head, array.length - head);
                ArrayUtility.clear(array, 0, tail);
            }
            _._head = 0;
            _._tail = 0;
            _._size = 0;
            _._version++;
            return size;
        };
        Queue.prototype.contains = function (item) {
            var _ = this;
            var array = _._array, index = _._head, count = _._size, len = _._capacity;
            while (count-- > 0) {
                if (System.areEqual(array[index], item))
                    return true;
                index = (index + 1) % len;
            }
            return false;
        };
        Queue.prototype.copyTo = function (target, arrayIndex) {
            if (arrayIndex === void 0) { arrayIndex = 0; }
            if (target == null)
                throw new Error("ArgumentNullException: array cannot be null.");
            assertIntegerZeroOrGreater(arrayIndex, "arrayIndex");
            var arrayLen = target.length, _ = this, size = _._size;
            var numToCopy = (arrayLen - arrayIndex < size) ? (arrayLen - arrayIndex) : size;
            if (numToCopy == 0)
                return;
            var source = _._array, len = _._capacity, head = _._head, lh = len - head;
            var firstPart = (lh < numToCopy) ? lh : numToCopy;
            ArrayUtility.copyTo(source, target, head, arrayIndex, firstPart);
            numToCopy -= firstPart;
            if (numToCopy > 0)
                ArrayUtility.copyTo(source, target, 0, arrayIndex + len - head, numToCopy);
        };
        Queue.prototype.remove = function (item) {
            throw new Error("ICollection\<T\>.remove is not implemented in Queue\<T\>" +
                " since it would require destroying the underlying array to remove the item.");
        };
        Queue.prototype.dispose = function () {
            var _ = this;
            _.clear();
            if (_._array != emptyArray) {
                _._array.length = _._capacity = 0;
                _._array = emptyArray;
            }
            _._version = 0;
        };
        Queue.prototype.toArray = function () {
            var _ = this, size = _._size;
            var arr = ArrayUtility.initialize(size);
            if (size == 0)
                return arr;
            _.copyTo(arr);
            return arr;
        };
        Queue.prototype.setCapacity = function (capacity) {
            assertIntegerZeroOrGreater(capacity, "capacity");
            var _ = this, array = _._array, len = _._capacity;
            if (capacity == len)
                return;
            var head = _._head, tail = _._tail, size = _._size;
            if (array != emptyArray && capacity > len && head < tail) {
                array.length = _._capacity = capacity;
                _._version++;
                return;
            }
            var newArray = ArrayUtility.initialize(capacity);
            if (size > 0) {
                if (head < tail) {
                    ArrayUtility.copyTo(array, newArray, head, 0, size);
                }
                else {
                    ArrayUtility.copyTo(array, newArray, head, 0, len - head);
                    ArrayUtility.copyTo(array, newArray, 0, len - head, tail);
                }
            }
            _._array = newArray;
            _._capacity = capacity;
            _._head = 0;
            _._tail = (size == capacity) ? 0 : size;
            _._version++;
        };
        Queue.prototype.enqueue = function (item) {
            var _ = this, array = _._array, size = _._size | 0, len = _._capacity | 0;
            if (size == len) {
                var newCapacity = len * GROW_FACTOR_HALF;
                if (newCapacity < len + MINIMUM_GROW)
                    newCapacity = len + MINIMUM_GROW;
                _.setCapacity(newCapacity);
                array = _._array;
                len = _._capacity;
            }
            var tail = _._tail;
            array[tail] = item;
            _._tail = (tail + 1) % len;
            _._size = size + 1;
            _._version++;
        };
        Queue.prototype.dequeue = function () {
            var _ = this;
            if (_._size == 0)
                throw new Error("InvalidOperationException: cannot dequeue an empty queue.");
            var array = _._array, head = _._head;
            var removed = _._array[head];
            array[head] = null;
            _._head = (head + 1) % _._capacity;
            _._size--;
            _._version++;
            return removed;
        };
        Queue.prototype._getElement = function (index) {
            assertIntegerZeroOrGreater(index, "index");
            var _ = this;
            return _._array[(_._head + index) % _._capacity];
        };
        Queue.prototype.peek = function () {
            if (this._size == 0)
                throw new Error("InvalidOperationException: cannot call peek on an empty queue.");
            return this._array[this._head];
        };
        Queue.prototype.trimExcess = function () {
            var _ = this;
            var size = _._size;
            if (size < Math.floor(_._capacity * 0.9))
                _.setCapacity(size);
        };
        Queue.prototype.getEnumerator = function () {
            var _ = this;
            var index;
            var version;
            return new EnumeratorBase(function () {
                version = _._version;
                index = 0;
            }, function (yielder) {
                if (version != _._version)
                    throw new Error("InvalidOperationException: collection was changed during enumeration.");
                if (index == _._size)
                    return yielder.yieldBreak();
                return yielder.yieldReturn(_._getElement(index++));
            });
        };
        return Queue;
    })();
    function assertInteger(value, property) {
        if (value != Math.floor(value))
            throw new Error("InvalidOperationException: " + property + " must be an integer.");
    }
    function assertZeroOrGreater(value, property) {
        if (value < 0)
            throw new Error("ArgumentOutOfRangeException: " + property + " must be greater than zero");
    }
    function assertIntegerZeroOrGreater(value, property) {
        assertInteger(value, property);
        assertZeroOrGreater(value, property);
    }
    return Queue;
});
//# sourceMappingURL=Queue.js.map