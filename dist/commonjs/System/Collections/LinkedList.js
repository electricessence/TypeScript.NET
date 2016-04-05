/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Values = require("../Compare");
var ArrayUtility = require("../Collections/Array/Utility");
var Enumerator = require("./Enumeration/Enumerator");
var EnumeratorBase_1 = require("./Enumeration/EnumeratorBase");
var LinkedNodeList_1 = require("./LinkedNodeList");
var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");

var InternalNode = function () {
    function InternalNode(value, previous, next) {
        _classCallCheck(this, InternalNode);

        this.value = value;
        this.previous = previous;
        this.next = next;
    }

    _createClass(InternalNode, [{
        key: "assertDetached",
        value: function assertDetached() {
            if (this.next || this.previous) throw new InvalidOperationException_1.default("Adding a node that is already placed.");
        }
    }]);

    return InternalNode;
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
    var n = node._nodeInternal;
    if (!n) throw new InvalidOperationException_1.default("Provided node is not valid.");
    return n;
}

var LinkedList = function () {
    function LinkedList(source) {
        _classCallCheck(this, LinkedList);

        var _ = this,
            c = 0;
        var e = Enumerator.from(source);
        var list = _._listInternal = new LinkedNodeList_1.default();
        while (e.moveNext()) {
            list.addNode(new InternalNode(e.current));
            ++c;
        }
        _._count = c;
    }

    _createClass(LinkedList, [{
        key: "forEach",
        value: function forEach(action) {
            var useCopy = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (useCopy) {
                var array = this.toArray();
                ArrayUtility.forEach(array, action);
                array.length = 0;
            } else {
                this._listInternal.forEach(function (node, i) {
                    return action(node.value, i);
                });
            }
        }
    }, {
        key: "getEnumerator",
        value: function getEnumerator() {
            var _ = this,
                current,
                next;
            return new EnumeratorBase_1.default(function () {
                current = null;
                next = _._listInternal.first;
            }, function (yielder) {
                if (next) {
                    current = next;
                    next = current && current.next;
                    return yielder.yieldReturn(current.value);
                }
                return yielder.yieldBreak();
            });
        }
    }, {
        key: "_findFirst",
        value: function _findFirst(entry) {
            var equals = Values.areEqual,
                next = this._listInternal.first;
            while (next) {
                if (equals(entry, next.value)) return next;
                next = next.next;
            }
            return null;
        }
    }, {
        key: "_findLast",
        value: function _findLast(entry) {
            var equals = Values.areEqual,
                prev = this._listInternal.last;
            while (prev) {
                if (equals(entry, prev.value)) return prev;
                prev = prev.previous;
            }
            return null;
        }
    }, {
        key: "add",
        value: function add(entry) {
            this._listInternal.addNode(new InternalNode(entry));
            this._count++;
        }
    }, {
        key: "clear",
        value: function clear() {
            this._count = 0;
            return this._listInternal.clear();
        }
    }, {
        key: "contains",
        value: function contains(entry) {
            var found = false,
                equals = Values.areEqual;
            this.forEach(function (e) {
                return !(found = equals(entry, e));
            });
            return found;
        }
    }, {
        key: "copyTo",
        value: function copyTo(array) {
            var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            if (!array) throw new ArgumentNullException_1.default('array');
            if (this._listInternal.first) {
                var minLength = index + this._count;
                if (array.length < minLength) array.length = minLength;
                this.forEach(function (entry, i) {
                    array[index + i] = entry;
                });
            }
            return array;
        }
    }, {
        key: "toArray",
        value: function toArray() {
            var array = ArrayUtility.initialize(this._count);
            return this.copyTo(array);
        }
    }, {
        key: "removeOnce",
        value: function removeOnce(entry) {
            return this.remove(entry, 1) !== 0;
        }
    }, {
        key: "remove",
        value: function remove(entry) {
            var max = arguments.length <= 1 || arguments[1] === undefined ? Infinity : arguments[1];

            var equals = Values.areEqual;
            var _ = this,
                list = _._listInternal,
                removedCount = 0;
            list.forEach(function (node) {
                if (equals(entry, node.value) && list.removeNode(node)) {
                    --_._count;
                    ++removedCount;
                }
                return removedCount < max;
            });
            return removedCount;
        }
    }, {
        key: "getValueAt",
        value: function getValueAt(index) {
            return this._listInternal.getNodeAt(index).value;
        }
    }, {
        key: "getNodeAt",
        value: function getNodeAt(index) {
            return ensureExternal(this._listInternal.getNodeAt(index), this);
        }
    }, {
        key: "find",
        value: function find(entry) {
            return ensureExternal(this._findFirst(entry), this);
        }
    }, {
        key: "findLast",
        value: function findLast(entry) {
            return ensureExternal(this._findLast(entry), this);
        }
    }, {
        key: "addFirst",
        value: function addFirst(entry) {
            this._listInternal.addNodeBefore(new InternalNode(entry));
            ++this._count;
        }
    }, {
        key: "addLast",
        value: function addLast(entry) {
            this.add(entry);
        }
    }, {
        key: "removeFirst",
        value: function removeFirst() {
            var _ = this,
                first = _._listInternal.first;
            if (first && _._listInternal.removeNode(first)) {
                _._count--;
            }
        }
    }, {
        key: "removeLast",
        value: function removeLast() {
            var _ = this,
                last = _._listInternal.last;
            if (last && _._listInternal.removeNode(last)) {
                --_._count;
            }
        }
    }, {
        key: "removeNode",
        value: function removeNode(node) {
            var _ = this,
                removed = _._listInternal.removeNode(getInternal(node, _));
            if (removed) --_._count;
            return removed;
        }
    }, {
        key: "addBefore",
        value: function addBefore(before, entry) {
            this._listInternal.addNodeBefore(new InternalNode(entry), getInternal(before, this));
            ++this._count;
        }
    }, {
        key: "addAfter",
        value: function addAfter(after, entry) {
            this._listInternal.addNodeAfter(new InternalNode(entry), getInternal(after, this));
            ++this._count;
        }
    }, {
        key: "addNodeBefore",
        value: function addNodeBefore(node, before) {
            this._listInternal.addNodeBefore(getInternal(before, this), getInternal(node, this));
            ++this._count;
        }
    }, {
        key: "addNodeAfter",
        value: function addNodeAfter(node, after) {
            this._listInternal.addNodeAfter(getInternal(after, this), getInternal(node, this));
            ++this._count;
        }
    }, {
        key: "count",
        get: function get() {
            return this._count;
        }
    }, {
        key: "isReadOnly",
        get: function get() {
            return false;
        }
    }, {
        key: "first",
        get: function get() {
            return ensureExternal(this._listInternal.first, this);
        }
    }, {
        key: "last",
        get: function get() {
            return ensureExternal(this._listInternal.last, this);
        }
    }]);

    return LinkedList;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinkedList;

var LinkedListNode = function () {
    function LinkedListNode(_list, _nodeInternal) {
        _classCallCheck(this, LinkedListNode);

        this._list = _list;
        this._nodeInternal = _nodeInternal;
    }

    _createClass(LinkedListNode, [{
        key: "addBefore",
        value: function addBefore(entry) {
            this._list.addBefore(this, entry);
        }
    }, {
        key: "addAfter",
        value: function addAfter(entry) {
            this._list.addAfter(this, entry);
        }
    }, {
        key: "addNodeBefore",
        value: function addNodeBefore(before) {
            this._list.addNodeBefore(this, before);
        }
    }, {
        key: "addNodeAfter",
        value: function addNodeAfter(after) {
            this._list.addNodeAfter(this, after);
        }
    }, {
        key: "remove",
        value: function remove() {
            this._list.removeNode(this);
        }
    }, {
        key: "list",
        get: function get() {
            return this._list;
        }
    }, {
        key: "previous",
        get: function get() {
            return ensureExternal(this._nodeInternal.previous, this._list);
        }
    }, {
        key: "next",
        get: function get() {
            return ensureExternal(this._nodeInternal.next, this._list);
        }
    }, {
        key: "value",
        get: function get() {
            return this._nodeInternal.value;
        },
        set: function set(v) {
            this._nodeInternal.value = v;
        }
    }]);

    return LinkedListNode;
}();
//# sourceMappingURL=LinkedList.js.map
