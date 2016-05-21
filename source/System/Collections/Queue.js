/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://referencesource.microsoft.com/#System/CompMod/system/collections/generic/queue.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Compare", "./Array/Utility", "../Types", "../Integer", "./Enumeration/EnumeratorBase", "../Exceptions/NotImplementedException", "../Exceptions/InvalidOperationException", "../Exceptions/ArgumentOutOfRangeException", "./CollectionBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Compare_1 = require("../Compare");
    var AU = require("./Array/Utility");
    var Types_1 = require("../Types");
    var Integer_1 = require("../Integer");
    var EnumeratorBase_1 = require("./Enumeration/EnumeratorBase");
    var NotImplementedException_1 = require("../Exceptions/NotImplementedException");
    var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
    var ArgumentOutOfRangeException_1 = require("../Exceptions/ArgumentOutOfRangeException");
    var CollectionBase_1 = require("./CollectionBase");
    var MINIMUM_GROW = 4;
    var SHRINK_THRESHOLD = 32;
    var GROW_FACTOR_HALF = 100;
    var DEFAULT_CAPACITY = MINIMUM_GROW;
    var emptyArray = [];
    var Queue = (function (_super) {
        __extends(Queue, _super);
        function Queue(source, equalityComparer) {
            if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
            _super.call(this, null, equalityComparer);
            var _ = this;
            _._head = 0;
            _._tail = 0;
            _._size = 0;
            if (!source)
                _._array = emptyArray;
            else {
                if (Types_1.Type.isNumber(source)) {
                    var capacity = source;
                    assertIntegerZeroOrGreater(capacity, "capacity");
                    _._array = capacity
                        ? AU.initialize(capacity)
                        : emptyArray;
                }
                else {
                    var se = source;
                    _._array = AU.initialize(Types_1.Type.isArrayLike(se)
                        ? se.length
                        : DEFAULT_CAPACITY);
                    _._importEntries(se);
                }
            }
            _._capacity = _._array.length;
        }
        Queue.prototype.getCount = function () {
            return this._size;
        };
        Queue.prototype._addInternal = function (item) {
            var _ = this, array = _._array, size = _._size, len = _._capacity;
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
            return true;
        };
        Queue.prototype._removeInternal = function (item, max) {
            throw new NotImplementedException_1.NotImplementedException("ICollection\<T\>.remove is not implemented in Queue\<T\>" +
                " since it would require destroying the underlying array to remove the item.");
        };
        Queue.prototype._clearInternal = function () {
            var _ = this, array = _._array, head = _._head, tail = _._tail, size = _._size;
            if (head < tail)
                AU.clear(array, head, tail);
            else {
                AU.clear(array, head, array.length - head);
                AU.clear(array, 0, tail);
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
        Queue.prototype.dump = function (max) {
            if (max === void 0) { max = Infinity; }
            var _ = this, result = [];
            if (isFinite(max)) {
                Integer_1.Integer.assertZeroOrGreater(max);
                if (max !== 0) {
                    while (max-- && _._size) {
                        result.push(_._dequeueInternal());
                    }
                }
            }
            else {
                while (_._size) {
                    result.push(_._dequeueInternal());
                }
            }
            _.trimExcess();
            _._signalModification();
            return result;
        };
        Queue.prototype.forEach = function (action) {
            return _super.prototype.forEach.call(this, action, true);
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
            var newArray = AU.initialize(capacity);
            if (size > 0) {
                if (head < tail) {
                    AU.copyTo(array, newArray, head, 0, size);
                }
                else {
                    AU.copyTo(array, newArray, head, 0, len - head);
                    AU.copyTo(array, newArray, 0, len - head, tail);
                }
            }
            _._array = newArray;
            _._capacity = capacity;
            _._head = 0;
            _._tail = (size == capacity) ? 0 : size;
            _._signalModification(true);
        };
        Queue.prototype.enqueue = function (item) {
            this.add(item);
        };
        Queue.prototype._dequeueInternal = function (throwIfEmpty) {
            if (throwIfEmpty === void 0) { throwIfEmpty = false; }
            var _ = this;
            if (_._size == 0) {
                if (throwIfEmpty)
                    throw new InvalidOperationException_1.InvalidOperationException("Cannot dequeue an empty queue.");
                return void 0;
            }
            var array = _._array, head = _._head;
            var removed = _._array[head];
            array[head] = null;
            _._head = (head + 1) % _._capacity;
            _._size--;
            _._incrementModified();
            return removed;
        };
        Queue.prototype.dequeue = function (throwIfEmpty) {
            if (throwIfEmpty === void 0) { throwIfEmpty = false; }
            var _ = this;
            _.assertModifiable();
            var modified = !!_._size;
            var v = this._dequeueInternal(throwIfEmpty);
            if (modified && _._size < _._capacity / 2)
                _.trimExcess(SHRINK_THRESHOLD);
            _._signalModification();
            return v;
        };
        Queue.prototype.tryDequeue = function (out) {
            if (!this._size)
                return false;
            var d = this.dequeue();
            if (out)
                out(d);
            return true;
        };
        Queue.prototype._getElement = function (index) {
            assertIntegerZeroOrGreater(index, "index");
            var _ = this;
            return _._array[(_._head + index) % _._capacity];
        };
        Queue.prototype.peek = function () {
            if (this._size == 0)
                throw new InvalidOperationException_1.InvalidOperationException("Cannot call peek on an empty queue.");
            return this._array[this._head];
        };
        Queue.prototype.trimExcess = function (threshold) {
            var _ = this;
            var size = _._size;
            if (size < Math.floor(_._capacity * 0.9) && (isNaN(threshold) || threshold < size))
                _.setCapacity(size);
        };
        Queue.prototype.getEnumerator = function () {
            var _ = this;
            var index;
            var version;
            return new EnumeratorBase_1.EnumeratorBase(function () {
                version = _._version;
                index = 0;
            }, function (yielder) {
                _.assertVersion(version);
                if (index == _._size)
                    return yielder.yieldBreak();
                return yielder.yieldReturn(_._getElement(index++));
            });
        };
        return Queue;
    }(CollectionBase_1.CollectionBase));
    exports.Queue = Queue;
    function assertZeroOrGreater(value, property) {
        if (value < 0)
            throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException(property, value, "Must be greater than zero");
    }
    function assertIntegerZeroOrGreater(value, property) {
        Integer_1.Integer.assert(value, property);
        assertZeroOrGreater(value, property);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Queue;
});
//# sourceMappingURL=Queue.js.map