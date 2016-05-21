/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compare_1 = require("../Compare");
var LinkedNodeList_1 = require("./LinkedNodeList");
var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var CollectionBase_1 = require("./CollectionBase");

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
            if (this.next || this.previous) throw new InvalidOperationException_1.InvalidOperationException("Adding a node that is already placed.");
        }
    }]);

    return InternalNode;
}();

function ensureExternal(node, list) {
    if (!node) return null;
    if (!list) throw new ArgumentNullException_1.ArgumentNullException("list");
    var external = node.external;
    if (!external) node.external = external = new LinkedListNode(list, node);
    return external;
}
function getInternal(node, list) {
    if (!node) throw new ArgumentNullException_1.ArgumentNullException("node");
    if (!list) throw new ArgumentNullException_1.ArgumentNullException("list");
    if (node.list != list) throw new InvalidOperationException_1.InvalidOperationException("Provided node does not belong to this list.");
    var n = node._nodeInternal;
    if (!n) throw new InvalidOperationException_1.InvalidOperationException("Provided node is not valid.");
    return n;
}

var LinkedList = function (_CollectionBase_1$Col) {
    _inherits(LinkedList, _CollectionBase_1$Col);

    function LinkedList(source) {
        var equalityComparer = arguments.length <= 1 || arguments[1] === undefined ? Compare_1.areEqual : arguments[1];

        _classCallCheck(this, LinkedList);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LinkedList).call(this, null, equalityComparer));

        var _ = _this;
        _._listInternal = new LinkedNodeList_1.LinkedNodeList();
        _._importEntries(source);
        return _this;
    }

    _createClass(LinkedList, [{
        key: "getCount",
        value: function getCount() {
            return this._listInternal.unsafeCount;
        }
    }, {
        key: "_addInternal",
        value: function _addInternal(entry) {
            this._listInternal.addNode(new InternalNode(entry));
            return true;
        }
    }, {
        key: "_removeInternal",
        value: function _removeInternal(entry) {
            var max = arguments.length <= 1 || arguments[1] === undefined ? Infinity : arguments[1];

            var _ = this,
                equals = _._equalityComparer,
                list = _._listInternal,
                removedCount = 0;
            list.forEach(function (node) {
                if (equals(entry, node.value) && list.removeNode(node)) removedCount++;
                return removedCount < max;
            });
            return removedCount;
        }
    }, {
        key: "_clearInternal",
        value: function _clearInternal() {
            return this._listInternal.clear();
        }
    }, {
        key: "forEach",
        value: function forEach(action) {
            var useCopy = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            return useCopy ? _get(Object.getPrototypeOf(LinkedList.prototype), "forEach", this).call(this, action, useCopy) : this._listInternal.forEach(function (node, i) {
                return action(node.value, i);
            });
        }
    }, {
        key: "getEnumerator",
        value: function getEnumerator() {
            return LinkedNodeList_1.LinkedNodeList.valueEnumeratorFrom(this._listInternal);
        }
    }, {
        key: "_findFirst",
        value: function _findFirst(entry) {
            var _ = this,
                equals = _._equalityComparer,
                next = _._listInternal.first;
            while (next) {
                if (equals(entry, next.value)) return next;
                next = next.next;
            }
            return null;
        }
    }, {
        key: "_findLast",
        value: function _findLast(entry) {
            var _ = this,
                equals = _._equalityComparer,
                prev = _._listInternal.last;
            while (prev) {
                if (equals(entry, prev.value)) return prev;
                prev = prev.previous;
            }
            return null;
        }
    }, {
        key: "removeOnce",
        value: function removeOnce(entry) {
            return this.remove(entry, 1) !== 0;
        }
    }, {
        key: "getValueAt",
        value: function getValueAt(index) {
            var node = this._listInternal.getNodeAt(index);
            if (!node) return node && node.value || void 0;
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
            this._signalModification(true);
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
            if (first && _._listInternal.removeNode(first)) _._signalModification(true);
        }
    }, {
        key: "removeLast",
        value: function removeLast() {
            var _ = this,
                last = _._listInternal.last;
            if (last && _._listInternal.removeNode(last)) _._signalModification(true);
        }
    }, {
        key: "removeNode",
        value: function removeNode(node) {
            var _ = this;
            if (_._listInternal.removeNode(getInternal(node, _))) {
                _._signalModification(true);
                return true;
            }
            return false;
        }
    }, {
        key: "addBefore",
        value: function addBefore(before, entry) {
            var _ = this;
            _._listInternal.addNodeBefore(new InternalNode(entry), getInternal(before, _));
            _._signalModification(true);
        }
    }, {
        key: "addAfter",
        value: function addAfter(after, entry) {
            var _ = this;
            _._listInternal.addNodeAfter(new InternalNode(entry), getInternal(after, _));
            _._signalModification(true);
        }
    }, {
        key: "addNodeBefore",
        value: function addNodeBefore(node, before) {
            var _ = this;
            _._listInternal.addNodeBefore(getInternal(before, _), getInternal(node, _));
            _._signalModification(true);
        }
    }, {
        key: "addNodeAfter",
        value: function addNodeAfter(node, after) {
            var _ = this;
            this._listInternal.addNodeAfter(getInternal(after, _), getInternal(node, _));
            _._signalModification(true);
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
}(CollectionBase_1.CollectionBase);

exports.LinkedList = LinkedList;

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

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinkedList;
//# sourceMappingURL=LinkedList.js.map
