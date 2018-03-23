/*!
 * @author: electricessence / https://github.com/electricessence/
 * Based Upon: http://referencesource.microsoft.com/#System/CompMod/system/collections/generic/queue.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import Integer from "../Integer";
import EnumeratorBase from "./Enumeration/EnumeratorBase";
import NotImplementedException from "../Exceptions/NotImplementedException";
import InvalidOperationException from "../Exceptions/InvalidOperationException";
import ArgumentOutOfRangeException from "../Exceptions/ArgumentOutOfRangeException";
import CollectionBase from "./CollectionBase";
import areEqual from "../Comparison/areEqual";
import initializeArray from "./Array/initializeArray";
import clearElements from "./Array/clearElements";
import isArrayLike from "../Reflection/isArrayLike";
import isNumber from "../Reflection/isNumber";
import copyArrayTo from "./Array/copyArrayTo";
var VOID0 = void 0;
var MINIMUM_GROW = 4;
var SHRINK_THRESHOLD = 32; // Unused?
// var GROW_FACTOR: number = 200;  // double each time
var GROW_FACTOR_HALF = 100;
var DEFAULT_CAPACITY = MINIMUM_GROW;
var emptyArray = Object.freeze([]);
var Queue = /** @class */ (function (_super) {
    tslib_1.__extends(Queue, _super);
    function Queue(source, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = areEqual; }
        var _this = _super.call(this, VOID0, equalityComparer) || this;
        _this._head = 0;
        _this._tail = 0;
        _this._size = 0;
        if (!source)
            _this._array = emptyArray;
        else {
            if (isNumber(source)) {
                var capacity = source;
                assertIntegerZeroOrGreater(capacity, "capacity");
                _this._array = capacity
                    ? initializeArray(capacity)
                    : emptyArray;
            }
            else {
                var se = source;
                _this._array = initializeArray(isArrayLike(se)
                    ? se.length
                    : DEFAULT_CAPACITY);
                _this._importEntries(se);
            }
        }
        _this._capacity = _this._array.length;
        return _this;
    }
    Queue.prototype.getCount = function () {
        return this._size;
    };
    Queue.prototype._addInternal = function (item) {
        var _ = this;
        var size = _._size;
        var len = _._capacity;
        if (size == len) {
            var newCapacity = len * GROW_FACTOR_HALF;
            if (newCapacity < len + MINIMUM_GROW)
                newCapacity = len + MINIMUM_GROW;
            _.setCapacity(newCapacity);
            len = _._capacity;
        }
        var tail = _._tail;
        _._array[tail] = item;
        _._tail = (tail + 1) % len;
        _._size = size + 1;
        return true;
    };
    //noinspection JSUnusedLocalSymbols
    Queue.prototype._removeInternal = function (item, max) {
        //noinspection HtmlUnknownTag
        throw new NotImplementedException("ICollection\<T\>.remove is not implemented in Queue\<T\>" +
            " since it would require destroying the underlying array to remove the item.");
    };
    Queue.prototype._clearInternal = function () {
        var _ = this;
        var array = _._array, head = _._head, tail = _._tail, size = _._size;
        if (head < tail)
            clearElements(array, head, tail);
        else {
            clearElements(array, head);
            clearElements(array, 0, tail);
        }
        _._head = 0;
        _._tail = 0;
        _._size = 0;
        _.trimExcess();
        return size;
    };
    Queue.prototype._onDispose = function () {
        _super.prototype._onDispose.call(this);
        var _ = this;
        if (_._array != emptyArray) {
            _._array.length = _._capacity = 0;
            _._array = emptyArray;
        }
    };
    /**
     * Dequeues entries into an array.
     */
    Queue.prototype.dump = function (max) {
        if (max === void 0) { max = Infinity; }
        var _ = this;
        var result = [];
        if (isFinite(max)) {
            Integer.assertZeroOrGreater(max);
            if (max !== 0) {
                while (max-- && _._tryDequeueInternal(function (value) {
                    result.push(value);
                })) { }
            }
        }
        else {
            while (_._tryDequeueInternal(function (value) {
                result.push(value);
            })) { }
        }
        _.trimExcess();
        _._signalModification();
        return result;
    };
    Queue.prototype.forEach = function (action) {
        return _super.prototype.forEach.call(this, action, true);
    };
    Queue.prototype.setCapacity = function (capacity) {
        var _ = this;
        assertIntegerZeroOrGreater(capacity, "capacity");
        var array = _._array, len = _._capacity;
        if (capacity > len)
            _.throwIfDisposed();
        if (capacity == len)
            return this;
        var head = _._head, tail = _._tail, size = _._size;
        // Special case where we can simply extend the length of the array. (JavaScript only)
        if (array != emptyArray && capacity > len && head < tail) {
            array.length = _._capacity = capacity;
            _._version++;
            return this;
        }
        // We create a new array because modifying an existing one could be slow.
        var newArray = initializeArray(capacity);
        if (size > 0) {
            if (head < tail) {
                copyArrayTo(array, newArray, head, 0, size);
            }
            else {
                copyArrayTo(array, newArray, head, 0, len - head);
                copyArrayTo(array, newArray, 0, len - head, tail);
            }
        }
        _._array = newArray;
        _._capacity = capacity;
        _._head = 0;
        _._tail = (size == capacity) ? 0 : size;
        _._signalModification(true);
        return this;
    };
    Queue.prototype.enqueue = function (item) {
        return this.add(item);
    };
    Queue.prototype._tryDequeueInternal = function (out) {
        var _ = this;
        if (!_._size)
            return false;
        var array = _._array, head = _._head;
        var removed = _._array[head];
        array[head] = null;
        _._head = (head + 1) % _._capacity;
        _._size--;
        _._incrementModified();
        out(removed);
        return true;
    };
    Queue.prototype.dequeue = function (throwIfEmpty) {
        if (throwIfEmpty === void 0) { throwIfEmpty = false; }
        var _ = this;
        _.assertModifiable();
        var result = VOID0;
        if (!this.tryDequeue(function (value) { result = value; }) && throwIfEmpty)
            throw new InvalidOperationException("Cannot dequeue an empty queue.");
        return result;
    };
    /**
     * Checks to see if the queue has entries an pulls an entry from the head of the queue and passes it to the out handler.
     * @param out The 'out' handler that receives the value if it exists.
     * @returns {boolean} True if a value was retrieved.  False if not.
     */
    Queue.prototype.tryDequeue = function (out) {
        var _ = this;
        if (!_._size)
            return false;
        _.assertModifiable();
        // A single dequeue shouldn't need update recursion tracking...
        if (this._tryDequeueInternal(out)) {
            // This may preemptively trigger the _onModified.
            if (_._size < _._capacity / 2)
                _.trimExcess(SHRINK_THRESHOLD);
            _._signalModification();
            return true;
        }
        return false;
    };
    Queue.prototype._getElement = function (index) {
        assertIntegerZeroOrGreater(index, "index");
        var _ = this;
        return _._array[(_._head + index) % _._capacity];
    };
    Queue.prototype.peek = function (throwIfEmpty) {
        if (throwIfEmpty === void 0) { throwIfEmpty = false; }
        if (this._size == 0) {
            if (throwIfEmpty)
                throw new InvalidOperationException("Cannot call peek on an empty queue.");
            return VOID0;
        }
        return this._array[this._head];
    };
    Queue.prototype.trimExcess = function (threshold) {
        var _ = this;
        var size = _._size;
        if (size < Math.floor(_._capacity * 0.9) && (!threshold && threshold !== 0 || isNaN(threshold) || threshold < size))
            _.setCapacity(size);
    };
    Queue.prototype.getEnumerator = function () {
        var _ = this;
        _.throwIfDisposed();
        var index, version, size;
        return new EnumeratorBase(function () {
            version = _._version;
            size = _._size;
            index = 0;
        }, function (yielder) {
            _.throwIfDisposed();
            _.assertVersion(version);
            if (index == size)
                return yielder.yieldBreak();
            return yielder.yieldReturn(_._getElement(index++));
        });
    };
    return Queue;
}(CollectionBase));
export default Queue;
function assertZeroOrGreater(value, property) {
    if (value < 0)
        throw new ArgumentOutOfRangeException(property, value, "Must be greater than zero");
    return true;
}
function assertIntegerZeroOrGreater(value, property) {
    Integer.assert(value, property);
    return assertZeroOrGreater(value, property);
}
//# sourceMappingURL=Queue.js.map