/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://referencesource.microsoft.com/#System/CompMod/system/collections/generic/queue.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var Queue = function (_CollectionBase_1$Col) {
    _inherits(Queue, _CollectionBase_1$Col);

    function Queue(source) {
        var equalityComparer = arguments.length <= 1 || arguments[1] === undefined ? Compare_1.areEqual : arguments[1];

        _classCallCheck(this, Queue);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Queue).call(this, null, equalityComparer));

        var _ = _this;
        _._head = 0;
        _._tail = 0;
        _._size = 0;
        if (!source) _._array = emptyArray;else {
            if (Types_1.Type.isNumber(source)) {
                var capacity = source;
                assertIntegerZeroOrGreater(capacity, "capacity");
                _._array = capacity ? AU.initialize(capacity) : emptyArray;
            } else {
                var se = source;
                _._array = AU.initialize(Types_1.Type.isArrayLike(se) ? se.length : DEFAULT_CAPACITY);
                _._importEntries(se);
            }
        }
        _._capacity = _._array.length;
        return _this;
    }

    _createClass(Queue, [{
        key: "getCount",
        value: function getCount() {
            return this._size;
        }
    }, {
        key: "_addInternal",
        value: function _addInternal(item) {
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
            return true;
        }
    }, {
        key: "_removeInternal",
        value: function _removeInternal(item, max) {
            throw new NotImplementedException_1.NotImplementedException("ICollection\<T\>.remove is not implemented in Queue\<T\>" + " since it would require destroying the underlying array to remove the item.");
        }
    }, {
        key: "_clearInternal",
        value: function _clearInternal() {
            var _ = this,
                array = _._array,
                head = _._head,
                tail = _._tail,
                size = _._size;
            if (head < tail) AU.clear(array, head, tail);else {
                AU.clear(array, head, array.length - head);
                AU.clear(array, 0, tail);
            }
            _._head = 0;
            _._tail = 0;
            _._size = 0;
            _.trimExcess();
            return size;
        }
    }, {
        key: "_onDispose",
        value: function _onDispose() {
            _get(Object.getPrototypeOf(Queue.prototype), "_onDispose", this).call(this);
            var _ = this;
            if (_._array != emptyArray) {
                _._array.length = _._capacity = 0;
                _._array = emptyArray;
            }
        }
    }, {
        key: "dump",
        value: function dump() {
            var max = arguments.length <= 0 || arguments[0] === undefined ? Infinity : arguments[0];

            var _ = this,
                result = [];
            if (isFinite(max)) {
                Integer_1.Integer.assertZeroOrGreater(max);
                if (max !== 0) {
                    while (max-- && _._size) {
                        result.push(_._dequeueInternal());
                    }
                }
            } else {
                while (_._size) {
                    result.push(_._dequeueInternal());
                }
            }
            _.trimExcess();
            _._signalModification();
            return result;
        }
    }, {
        key: "forEach",
        value: function forEach(action) {
            return _get(Object.getPrototypeOf(Queue.prototype), "forEach", this).call(this, action, true);
        }
    }, {
        key: "setCapacity",
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
            _._signalModification(true);
        }
    }, {
        key: "enqueue",
        value: function enqueue(item) {
            this.add(item);
        }
    }, {
        key: "_dequeueInternal",
        value: function _dequeueInternal() {
            var throwIfEmpty = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            var _ = this;
            if (_._size == 0) {
                if (throwIfEmpty) throw new InvalidOperationException_1.InvalidOperationException("Cannot dequeue an empty queue.");
                return void 0;
            }
            var array = _._array,
                head = _._head;
            var removed = _._array[head];
            array[head] = null;
            _._head = (head + 1) % _._capacity;
            _._size--;
            _._incrementModified();
            return removed;
        }
    }, {
        key: "dequeue",
        value: function dequeue() {
            var throwIfEmpty = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            var _ = this;
            _.assertModifiable();
            var modified = !!_._size;
            var v = this._dequeueInternal(throwIfEmpty);
            if (modified && _._size < _._capacity / 2) _.trimExcess(SHRINK_THRESHOLD);
            _._signalModification();
            return v;
        }
    }, {
        key: "tryDequeue",
        value: function tryDequeue(out) {
            if (!this._size) return false;
            var d = this.dequeue();
            if (out) out(d);
            return true;
        }
    }, {
        key: "_getElement",
        value: function _getElement(index) {
            assertIntegerZeroOrGreater(index, "index");
            var _ = this;
            return _._array[(_._head + index) % _._capacity];
        }
    }, {
        key: "peek",
        value: function peek() {
            if (this._size == 0) throw new InvalidOperationException_1.InvalidOperationException("Cannot call peek on an empty queue.");
            return this._array[this._head];
        }
    }, {
        key: "trimExcess",
        value: function trimExcess(threshold) {
            var _ = this;
            var size = _._size;
            if (size < Math.floor(_._capacity * 0.9) && (isNaN(threshold) || threshold < size)) _.setCapacity(size);
        }
    }, {
        key: "getEnumerator",
        value: function getEnumerator() {
            var _ = this;
            var index;
            var version;
            return new EnumeratorBase_1.EnumeratorBase(function () {
                version = _._version;
                index = 0;
            }, function (yielder) {
                _.assertVersion(version);
                if (index == _._size) return yielder.yieldBreak();
                return yielder.yieldReturn(_._getElement(index++));
            });
        }
    }]);

    return Queue;
}(CollectionBase_1.CollectionBase);

exports.Queue = Queue;
function assertZeroOrGreater(value, property) {
    if (value < 0) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException(property, value, "Must be greater than zero");
}
function assertIntegerZeroOrGreater(value, property) {
    Integer_1.Integer.assert(value, property);
    assertZeroOrGreater(value, property);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Queue;
//# sourceMappingURL=Queue.js.map
