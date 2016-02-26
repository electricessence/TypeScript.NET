/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://referencesource.microsoft.com/#System/CompMod/system/collections/generic/queue.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Values = require('../Compare');
var AU = require('./Array/Utility');
var Types_1 = require('../Types');
var Integer_1 = require('../Integer');
var EnumeratorBase_1 = require('./Enumeration/EnumeratorBase');
var forEach_1 = require('./Enumeration/forEach');
var NotImplementedException_1 = require('../Exceptions/NotImplementedException');
var InvalidOperationException_1 = require('../Exceptions/InvalidOperationException');
var ArgumentOutOfRangeException_1 = require('../Exceptions/ArgumentOutOfRangeException');
var MINIMUM_GROW = 4;
var SHRINK_THRESHOLD = 32;
var GROW_FACTOR_HALF = 100;
var DEFAULT_CAPACITY = MINIMUM_GROW;
var emptyArray = [];

var Queue = function () {
    function Queue(source) {
        _classCallCheck(this, Queue);

        var _ = this;
        _._head = 0;
        _._tail = 0;
        _._size = 0;
        _._version = 0;
        if (!source) _._array = emptyArray;else {
            if (Types_1.default.isNumber(source)) {
                var capacity = source;
                assertIntegerZeroOrGreater(capacity, "capacity");
                _._array = capacity ? AU.initialize(capacity) : emptyArray;
            } else {
                var se = source;
                _._array = AU.initialize(Types_1.default.isArrayLike(se) ? se.length : DEFAULT_CAPACITY);
                forEach_1.default(se, function (e) {
                    return _.enqueue(e);
                });
                _._version = 0;
            }
        }
        _._capacity = _._array.length;
    }

    _createClass(Queue, [{
        key: 'add',
        value: function add(item) {
            this.enqueue(item);
        }
    }, {
        key: 'clear',
        value: function clear() {
            var _ = this,
                array = _._array,
                head = _._head,
                tail = _._tail,
                size = _._size;
            if (head < tail) AU.clear(array, head, size);else {
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
    }, {
        key: 'dump',
        value: function dump() {
            var max = arguments.length <= 0 || arguments[0] === undefined ? Infinity : arguments[0];

            if (Types_1.default.isNumber(max, false) && max < 0) throw new ArgumentOutOfRangeException_1.default('max', max, 'must be greater than or equal to 0.');
            var _ = this,
                result = [];
            if (isFinite(max)) {
                Integer_1.default.assert(max, 'max');
                while (max-- && _._size) {
                    result.push(_.dequeue());
                }
            } else {
                while (_._size) {
                    result.push(_.dequeue());
                }
            }
            _.trimExcess();
            return result;
        }
    }, {
        key: 'contains',
        value: function contains(item) {
            var _ = this;
            var array = _._array,
                index = _._head,
                count = _._size,
                len = _._capacity;
            while (count-- > 0) {
                if (Values.areEqual(array[index], item)) return true;
                index = (index + 1) % len;
            }
            return false;
        }
    }, {
        key: 'copyTo',
        value: function copyTo(target) {
            var arrayIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            if (target == null) throw new Error("ArgumentNullException: array cannot be null.");
            assertIntegerZeroOrGreater(arrayIndex, "arrayIndex");
            var _ = this,
                size = _._size;
            if (!size) return;
            var numToCopy = size,
                source = _._array,
                len = _._capacity,
                head = _._head,
                lh = len - head,
                firstPart = lh < size ? lh : size;
            AU.copyTo(source, target, head, arrayIndex, firstPart);
            numToCopy -= firstPart;
            if (numToCopy > 0) AU.copyTo(source, target, 0, arrayIndex + len - head, numToCopy);
            return target;
        }
    }, {
        key: 'toArray',
        value: function toArray() {
            var _ = this,
                size = _._size;
            var arr = AU.initialize(size);
            return size ? _.copyTo(arr) : arr;
        }
    }, {
        key: 'remove',
        value: function remove(item) {
            throw new NotImplementedException_1.default("ICollection\<T\>.remove is not implemented in Queue\<T\>" + " since it would require destroying the underlying array to remove the item.");
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            var _ = this;
            _.clear();
            if (_._array != emptyArray) {
                _._array.length = _._capacity = 0;
                _._array = emptyArray;
            }
            _._version = 0;
        }
    }, {
        key: 'forEach',
        value: function forEach(action) {
            var _ = this,
                copy = _.toArray(),
                len = _._size;
            for (var i = 0; i < len; i++) {
                if (action(copy[i], i) === false) break;
            }
        }
    }, {
        key: 'setCapacity',
        value: function setCapacity(capacity) {
            assertIntegerZeroOrGreater(capacity, "capacity");
            var _ = this,
                array = _._array,
                len = _._capacity;
            if (capacity == len) return;
            var head = _._head,
                tail = _._tail,
                size = _._size;
            if (array != emptyArray && capacity > len && head < tail) {
                array.length = _._capacity = capacity;
                _._version++;
                return;
            }
            var newArray = AU.initialize(capacity);
            if (size > 0) {
                if (head < tail) {
                    AU.copyTo(array, newArray, head, 0, size);
                } else {
                    AU.copyTo(array, newArray, head, 0, len - head);
                    AU.copyTo(array, newArray, 0, len - head, tail);
                }
            }
            _._array = newArray;
            _._capacity = capacity;
            _._head = 0;
            _._tail = size == capacity ? 0 : size;
            _._version++;
        }
    }, {
        key: 'enqueue',
        value: function enqueue(item) {
            var _ = this,
                array = _._array,
                size = _._size,
                len = _._capacity;
            if (size == len) {
                var newCapacity = len * GROW_FACTOR_HALF;
                if (newCapacity < len + MINIMUM_GROW) newCapacity = len + MINIMUM_GROW;
                _.setCapacity(newCapacity);
                array = _._array;
                len = _._capacity;
            }
            var tail = _._tail;
            array[tail] = item;
            _._tail = (tail + 1) % len;
            _._size = size + 1;
            _._version++;
        }
    }, {
        key: 'dequeue',
        value: function dequeue() {
            var throwIfEmpty = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            var _ = this;
            if (_._size == 0) {
                if (throwIfEmpty) throw new InvalidOperationException_1.default("Cannot dequeue an empty queue.");
                return void 0;
            }
            var array = _._array,
                head = _._head;
            var removed = _._array[head];
            array[head] = null;
            _._head = (head + 1) % _._capacity;
            _._size--;
            if (_._size < _._capacity / 2) {
                _.trimExcess(SHRINK_THRESHOLD);
            }
            _._version++;
            return removed;
        }
    }, {
        key: 'tryDequeue',
        value: function tryDequeue(out) {
            if (!this._size) return false;
            var d = this.dequeue();
            if (out) out(d);
            return true;
        }
    }, {
        key: '_getElement',
        value: function _getElement(index) {
            assertIntegerZeroOrGreater(index, "index");
            var _ = this;
            return _._array[(_._head + index) % _._capacity];
        }
    }, {
        key: 'peek',
        value: function peek() {
            if (this._size == 0) throw new InvalidOperationException_1.default("Cannot call peek on an empty queue.");
            return this._array[this._head];
        }
    }, {
        key: 'trimExcess',
        value: function trimExcess(threshold) {
            var _ = this;
            var size = _._size;
            if (size < Math.floor(_._capacity * 0.9) && (isNaN(threshold) || threshold < size)) _.setCapacity(size);
        }
    }, {
        key: 'getEnumerator',
        value: function getEnumerator() {
            var _ = this;
            var index;
            var version;
            return new EnumeratorBase_1.default(function () {
                version = _._version;
                index = 0;
            }, function (yielder) {
                if (version != _._version) throw new InvalidOperationException_1.default("Collection was changed during enumeration.");
                if (index == _._size) return yielder.yieldBreak();
                return yielder.yieldReturn(_._getElement(index++));
            });
        }
    }, {
        key: 'count',
        get: function get() {
            return this._size;
        }
    }, {
        key: 'isReadOnly',
        get: function get() {
            return false;
        }
    }]);

    return Queue;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Queue;
function assertZeroOrGreater(value, property) {
    if (value < 0) throw new ArgumentOutOfRangeException_1.default(property, value, "Must be greater than zero");
}
function assertIntegerZeroOrGreater(value, property) {
    Integer_1.default.assert(value, property);
    assertZeroOrGreater(value, property);
}
//# sourceMappingURL=Queue.js.map
