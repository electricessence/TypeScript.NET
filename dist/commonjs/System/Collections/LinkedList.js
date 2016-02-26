/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Values = require('../Compare');
var TextUtility = require('../Text/Utility');
var ArrayUtility = require('../Collections/Array/Utility');
var Enumerator = require('./Enumeration/Enumerator');
var EnumeratorBase_1 = require('./Enumeration/EnumeratorBase');
var InvalidOperationException_1 = require('../Exceptions/InvalidOperationException');
var ArgumentException_1 = require('../Exceptions/ArgumentException');
var ArgumentNullException_1 = require('../Exceptions/ArgumentNullException');
var ArgumentOutOfRangeException_1 = require('../Exceptions/ArgumentOutOfRangeException');

var Node = function () {
    function Node(value, prev, next) {
        _classCallCheck(this, Node);

        this.value = value;
        this.prev = prev;
        this.next = next;
    }

    _createClass(Node, [{
        key: 'assertDetached',
        value: function assertDetached() {
            if (this.next || this.prev) throw new InvalidOperationException_1.default("Adding a node that is already placed.");
        }
    }]);

    return Node;
}();

function ensureExternal(node, list) {
    if (!node) return null;
    var external = node.external;
    if (!external) node.external = external = new LinkedListNode(list, node);
    return external;
}
function getInternal(node, list) {
    if (!node) throw new ArgumentNullException_1.default("Cannot be null.");
    if (node.list != list) throw new InvalidOperationException_1.default("Provided node does not belong to this list.");
    var n = node._node;
    if (!n) throw new InvalidOperationException_1.default("Provided node is not valid.");
    return n;
}

var LinkedList = function () {
    function LinkedList(source) {
        _classCallCheck(this, LinkedList);

        var _ = this,
            c = 0,
            first = null,
            last = null;
        var e = Enumerator.from(source);
        if (e.moveNext()) {
            first = last = new Node(e.current);
            ++c;
        }
        while (e.moveNext()) {
            last = last.next = new Node(e.current, last);
            ++c;
        }
        _._first = first;
        _._last = last;
        _._count = c;
    }

    _createClass(LinkedList, [{
        key: '_addFirst',
        value: function _addFirst(entry) {
            var _ = this,
                first = _._first;
            var prev = new Node(entry, null, first);
            if (first) first.prev = prev;else _._last = prev;
            _._first = prev;
            _._count += 1;
            return prev;
        }
    }, {
        key: '_addLast',
        value: function _addLast(entry) {
            var _ = this,
                last = _._last;
            var next = new Node(entry, last);
            if (last) last.next = next;else _._first = next;
            _._last = next;
            _._count += 1;
            return next;
        }
    }, {
        key: '_addNodeBefore',
        value: function _addNodeBefore(n, inserting) {
            inserting.assertDetached();
            inserting.next = n;
            inserting.prev = n.prev;
            n.prev.next = inserting;
            n.prev = inserting;
            this._count += 1;
        }
    }, {
        key: '_addNodeAfter',
        value: function _addNodeAfter(n, inserting) {
            inserting.assertDetached();
            inserting.prev = n;
            inserting.next = n.next;
            n.next.prev = inserting;
            n.next = inserting;
            this._count += 1;
        }
    }, {
        key: '_findFirst',
        value: function _findFirst(entry) {
            var equals = Values.areEqual,
                next = this._first;
            while (next) {
                if (equals(entry, next.value)) return next;
                next = next.next;
            }
            return null;
        }
    }, {
        key: '_findLast',
        value: function _findLast(entry) {
            var equals = Values.areEqual,
                prev = this._last;
            while (prev) {
                if (equals(entry, prev.value)) return prev;
                prev = prev.prev;
            }
            return null;
        }
    }, {
        key: 'forEach',
        value: function forEach(action) {
            var useCopy = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (useCopy) {
                var array = this.toArray();
                ArrayUtility.forEach(array, action);
                array.length = 0;
            } else {
                var next = this._first,
                    index = 0;
                while (next && action(next.value, index++) !== false) {
                    next = next.next;
                }
            }
        }
    }, {
        key: 'getEnumerator',
        value: function getEnumerator() {
            var _ = this,
                current;
            return new EnumeratorBase_1.default(function () {
                current = new Node(null, null, _._first);
            }, function (yielder) {
                return (current = current.next) ? yielder.yieldReturn(current.value) : yielder.yieldBreak();
            });
        }
    }, {
        key: 'add',
        value: function add(entry) {
            this._addLast(entry);
        }
    }, {
        key: 'clear',
        value: function clear() {
            var _ = this;
            _._first = null;
            _._last = null;
            var count = _._count;
            _._count = 0;
            return count;
        }
    }, {
        key: 'contains',
        value: function contains(entry) {
            var found = false,
                equals = Values.areEqual;
            this.forEach(function (e) {
                return !(found = equals(entry, e));
            });
            return found;
        }
    }, {
        key: 'copyTo',
        value: function copyTo(array) {
            var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            this.forEach(function (entry, i) {
                array[index + i] = entry;
            });
            return array;
        }
    }, {
        key: 'toArray',
        value: function toArray() {
            var array = ArrayUtility.initialize(this._count);
            return this.copyTo(array);
        }
    }, {
        key: 'removeOnce',
        value: function removeOnce(entry) {
            var _ = this;
            var node = _._findFirst(entry);
            if (node) {
                var prev = node.prev,
                    next = node.next;
                if (prev) prev.next = next;else _._first = next;
                if (next) next.prev = prev;else _._last = prev;
                _._count -= 1;
            }
            return node != null;
        }
    }, {
        key: 'remove',
        value: function remove(entry) {
            var _ = this,
                removedCount = 0;
            while (_.removeOnce(entry)) {
                ++removedCount;
            }
            return removedCount;
        }
    }, {
        key: '_getNodeAt',
        value: function _getNodeAt(index) {
            if (index < 0) throw new ArgumentOutOfRangeException_1.default('index', index, 'Is less than zero.');
            if (index >= this._count) throw new ArgumentOutOfRangeException_1.default('index', index, 'Is greater than count.');
            var next = this._first,
                i = 0;
            while (next && index < i++) {
                next = next.next;
            }
            return next;
        }
    }, {
        key: 'getValueAt',
        value: function getValueAt(index) {
            return this._getNodeAt(index).value;
        }
    }, {
        key: 'getNodeAt',
        value: function getNodeAt(index) {
            return ensureExternal(this._getNodeAt(index), this);
        }
    }, {
        key: 'find',
        value: function find(entry) {
            return ensureExternal(this._findFirst(entry), this);
        }
    }, {
        key: 'findLast',
        value: function findLast(entry) {
            return ensureExternal(this._findLast(entry), this);
        }
    }, {
        key: 'addFirst',
        value: function addFirst(entry) {
            this._addFirst(entry);
        }
    }, {
        key: 'addLast',
        value: function addLast(entry) {
            this._addLast(entry);
        }
    }, {
        key: 'removeFirst',
        value: function removeFirst() {
            var _ = this,
                first = _._first;
            if (first) {
                var next = first.next;
                _._first = next;
                if (next) next.prev = null;
                _._count -= 1;
            }
        }
    }, {
        key: 'removeLast',
        value: function removeLast() {
            var _ = this,
                last = _._last;
            if (last) {
                var prev = last.prev;
                _._last = prev;
                if (prev) prev.next = null;
                _._count -= 1;
            }
        }
    }, {
        key: 'removeNode',
        value: function removeNode(node) {
            var _ = this;
            var n = getInternal(node, _);
            var prev = n.prev,
                next = n.next,
                a = false,
                b = false;
            if (prev) prev.next = next;else if (_._first == n) _._first = next;else a = true;
            if (next) next.prev = prev;else if (_._last == n) _._last = prev;else b = true;
            if (a !== b) {
                throw new ArgumentException_1.default('node', TextUtility.format("Provided node is has no {0} reference but is not the {1} node!", a ? "previous" : "next", a ? "first" : "last"));
            }
            return !a && !b;
        }
    }, {
        key: 'addBefore',
        value: function addBefore(node, entry) {
            this._addNodeBefore(getInternal(node, this), new Node(entry));
        }
    }, {
        key: 'addAfter',
        value: function addAfter(node, entry) {
            this._addNodeAfter(getInternal(node, this), new Node(entry));
        }
    }, {
        key: 'addNodeBefore',
        value: function addNodeBefore(node, before) {
            this._addNodeBefore(getInternal(node, this), getInternal(before, this));
        }
    }, {
        key: 'addNodeAfter',
        value: function addNodeAfter(node, after) {
            this._addNodeAfter(getInternal(node, this), getInternal(after, this));
        }
    }, {
        key: 'count',
        get: function get() {
            return this._count;
        }
    }, {
        key: 'isReadOnly',
        get: function get() {
            return false;
        }
    }, {
        key: 'first',
        get: function get() {
            return ensureExternal(this._first, this);
        }
    }, {
        key: 'last',
        get: function get() {
            return ensureExternal(this._last, this);
        }
    }]);

    return LinkedList;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinkedList;

var LinkedListNode = function () {
    function LinkedListNode(_list, _node) {
        _classCallCheck(this, LinkedListNode);

        this._list = _list;
        this._node = _node;
    }

    _createClass(LinkedListNode, [{
        key: 'addBefore',
        value: function addBefore(entry) {
            this._list.addBefore(this, entry);
        }
    }, {
        key: 'addAfter',
        value: function addAfter(entry) {
            this._list.addAfter(this, entry);
        }
    }, {
        key: 'addNodeBefore',
        value: function addNodeBefore(before) {
            this._list.addNodeBefore(this, before);
        }
    }, {
        key: 'addNodeAfter',
        value: function addNodeAfter(after) {
            this._list.addNodeAfter(this, after);
        }
    }, {
        key: 'remove',
        value: function remove() {
            this._list.removeNode(this);
        }
    }, {
        key: 'list',
        get: function get() {
            return this._list;
        }
    }, {
        key: 'previous',
        get: function get() {
            return ensureExternal(this._node.prev, this._list);
        }
    }, {
        key: 'next',
        get: function get() {
            return ensureExternal(this._node.next, this._list);
        }
    }, {
        key: 'value',
        get: function get() {
            return this._node.value;
        },
        set: function set(v) {
            this._node.value = v;
        }
    }]);

    return LinkedListNode;
}();
//# sourceMappingURL=LinkedList.js.map
