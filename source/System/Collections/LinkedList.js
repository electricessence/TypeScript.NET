/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
///<reference path="ILinkedListNode.d.ts"/>
///<reference path="ILinkedList.d.ts"/>
'use strict';
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../Compare', '../Text/Utility', '../Collections/Array/Utility', './Enumeration/Enumerator', './Enumeration/EnumeratorBase', '../Exceptions/InvalidOperationException', '../Exceptions/ArgumentException', '../Exceptions/ArgumentNullException', '../Exceptions/ArgumentOutOfRangeException'], function (require, exports) {
    var Values = require('../Compare');
    var TextUtility = require('../Text/Utility');
    var ArrayUtility = require('../Collections/Array/Utility');
    var Enumerator = require('./Enumeration/Enumerator');
    var EnumeratorBase_1 = require('./Enumeration/EnumeratorBase');
    var InvalidOperationException_1 = require('../Exceptions/InvalidOperationException');
    var ArgumentException_1 = require('../Exceptions/ArgumentException');
    var ArgumentNullException_1 = require('../Exceptions/ArgumentNullException');
    var ArgumentOutOfRangeException_1 = require('../Exceptions/ArgumentOutOfRangeException');
    var Node = (function () {
        function Node(value, prev, next) {
            this.value = value;
            this.prev = prev;
            this.next = next;
        }
        Node.prototype.assertDetached = function () {
            if (this.next || this.prev)
                throw new InvalidOperationException_1.default("Adding a node that is already placed.");
        };
        return Node;
    })();
    function ensureExternal(node, list) {
        if (!node)
            return null;
        var external = node.external;
        if (!external)
            node.external = external = new LinkedListNode(list, node);
        return external;
    }
    function getInternal(node, list) {
        if (!node)
            throw new ArgumentNullException_1.default("Cannot be null.");
        if (node.list != list)
            throw new InvalidOperationException_1.default("Provided node does not belong to this list.");
        var n = node._node;
        if (!n)
            throw new InvalidOperationException_1.default("Provided node is not valid.");
        return n;
    }
    var LinkedList = (function () {
        function LinkedList(source) {
            var _ = this, c = 0, first = null, last = null;
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
        LinkedList.prototype._addFirst = function (entry) {
            var _ = this, first = _._first;
            var prev = new Node(entry, null, first);
            if (first)
                first.prev = prev;
            else
                _._last = prev;
            _._first = prev;
            _._count += 1;
            return prev;
        };
        LinkedList.prototype._addLast = function (entry) {
            var _ = this, last = _._last;
            var next = new Node(entry, last);
            if (last)
                last.next = next;
            else
                _._first = next;
            _._last = next;
            _._count += 1;
            return next;
        };
        LinkedList.prototype._addNodeBefore = function (n, inserting) {
            inserting.assertDetached();
            inserting.next = n;
            inserting.prev = n.prev;
            n.prev.next = inserting;
            n.prev = inserting;
            this._count += 1;
        };
        LinkedList.prototype._addNodeAfter = function (n, inserting) {
            inserting.assertDetached();
            inserting.prev = n;
            inserting.next = n.next;
            n.next.prev = inserting;
            n.next = inserting;
            this._count += 1;
        };
        LinkedList.prototype._findFirst = function (entry) {
            var equals = Values.areEqual, next = this._first;
            while (next) {
                if (equals(entry, next.value))
                    return next;
                next = next.next;
            }
            return null;
        };
        LinkedList.prototype._findLast = function (entry) {
            var equals = Values.areEqual, prev = this._last;
            while (prev) {
                if (equals(entry, prev.value))
                    return prev;
                prev = prev.prev;
            }
            return null;
        };
        LinkedList.prototype.forEach = function (action, useCopy) {
            if (useCopy === void 0) { useCopy = false; }
            if (useCopy) {
                var array = this.toArray();
                ArrayUtility.forEach(array, action);
                array.length = 0;
            }
            else {
                var next = this._first, index = 0;
                while (next && action(next.value, index++) !== false) {
                    next = next.next;
                }
            }
        };
        LinkedList.prototype.getEnumerator = function () {
            var _ = this, current;
            return new EnumeratorBase_1.default(function () {
                current = new Node(null, null, _._first);
            }, function (yielder) {
                return (current = current.next)
                    ? yielder.yieldReturn(current.value)
                    : yielder.yieldBreak();
            });
        };
        Object.defineProperty(LinkedList.prototype, "count", {
            get: function () {
                return this._count;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "isReadOnly", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        LinkedList.prototype.add = function (entry) {
            this._addLast(entry);
        };
        LinkedList.prototype.clear = function () {
            var _ = this;
            _._first = null;
            _._last = null;
            var count = _._count;
            _._count = 0;
            return count;
        };
        LinkedList.prototype.contains = function (entry) {
            var found = false, equals = Values.areEqual;
            this.forEach(function (e) { return !(found = equals(entry, e)); });
            return found;
        };
        LinkedList.prototype.copyTo = function (array, index) {
            if (index === void 0) { index = 0; }
            this.forEach(function (entry, i) {
                array[index + i] = entry;
            });
            return array;
        };
        LinkedList.prototype.toArray = function () {
            var array = ArrayUtility.initialize(this._count);
            return this.copyTo(array);
        };
        LinkedList.prototype.removeOnce = function (entry) {
            var _ = this;
            var node = _._findFirst(entry);
            if (node) {
                var prev = node.prev, next = node.next;
                if (prev)
                    prev.next = next;
                else
                    _._first = next;
                if (next)
                    next.prev = prev;
                else
                    _._last = prev;
                _._count -= 1;
            }
            return node != null;
        };
        LinkedList.prototype.remove = function (entry) {
            var _ = this, removedCount = 0;
            while (_.removeOnce(entry)) {
                ++removedCount;
            }
            return removedCount;
        };
        Object.defineProperty(LinkedList.prototype, "first", {
            get: function () {
                return ensureExternal(this._first, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "last", {
            get: function () {
                return ensureExternal(this._last, this);
            },
            enumerable: true,
            configurable: true
        });
        LinkedList.prototype._getNodeAt = function (index) {
            if (index < 0)
                throw new ArgumentOutOfRangeException_1.default('index', index, 'Is less than zero.');
            if (index >= this._count)
                throw new ArgumentOutOfRangeException_1.default('index', index, 'Is greater than count.');
            var next = this._first, i = 0;
            while (next && index < i++) {
                next = next.next;
            }
            return next;
        };
        LinkedList.prototype.getValueAt = function (index) {
            return this._getNodeAt(index).value;
        };
        LinkedList.prototype.getNodeAt = function (index) {
            return ensureExternal(this._getNodeAt(index), this);
        };
        LinkedList.prototype.find = function (entry) {
            return ensureExternal(this._findFirst(entry), this);
        };
        LinkedList.prototype.findLast = function (entry) {
            return ensureExternal(this._findLast(entry), this);
        };
        LinkedList.prototype.addFirst = function (entry) {
            this._addFirst(entry);
        };
        LinkedList.prototype.addLast = function (entry) {
            this._addLast(entry);
        };
        LinkedList.prototype.removeFirst = function () {
            var _ = this, first = _._first;
            if (first) {
                var next = first.next;
                _._first = next;
                if (next)
                    next.prev = null;
                _._count -= 1;
            }
        };
        LinkedList.prototype.removeLast = function () {
            var _ = this, last = _._last;
            if (last) {
                var prev = last.prev;
                _._last = prev;
                if (prev)
                    prev.next = null;
                _._count -= 1;
            }
        };
        LinkedList.prototype.removeNode = function (node) {
            var _ = this;
            var n = getInternal(node, _);
            var prev = n.prev, next = n.next, a = false, b = false;
            if (prev)
                prev.next = next;
            else if (_._first == n)
                _._first = next;
            else
                a = true;
            if (next)
                next.prev = prev;
            else if (_._last == n)
                _._last = prev;
            else
                b = true;
            if (a !== b) {
                throw new ArgumentException_1.default('node', TextUtility.format("Provided node is has no {0} reference but is not the {1} node!", a ? "previous" : "next", a ? "first" : "last"));
            }
            return !a && !b;
        };
        LinkedList.prototype.addBefore = function (node, entry) {
            this._addNodeBefore(getInternal(node, this), new Node(entry));
        };
        LinkedList.prototype.addAfter = function (node, entry) {
            this._addNodeAfter(getInternal(node, this), new Node(entry));
        };
        LinkedList.prototype.addNodeBefore = function (node, before) {
            this._addNodeBefore(getInternal(node, this), getInternal(before, this));
        };
        LinkedList.prototype.addNodeAfter = function (node, after) {
            this._addNodeAfter(getInternal(node, this), getInternal(after, this));
        };
        return LinkedList;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LinkedList;
    var LinkedListNode = (function () {
        function LinkedListNode(_list, _node) {
            this._list = _list;
            this._node = _node;
        }
        Object.defineProperty(LinkedListNode.prototype, "list", {
            get: function () {
                return this._list;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedListNode.prototype, "previous", {
            get: function () {
                return ensureExternal(this._node.prev, this._list);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedListNode.prototype, "next", {
            get: function () {
                return ensureExternal(this._node.next, this._list);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedListNode.prototype, "value", {
            get: function () {
                return this._node.value;
            },
            set: function (v) {
                this._node.value = v;
            },
            enumerable: true,
            configurable: true
        });
        LinkedListNode.prototype.addBefore = function (entry) {
            this._list.addBefore(this, entry);
        };
        LinkedListNode.prototype.addAfter = function (entry) {
            this._list.addAfter(this, entry);
        };
        LinkedListNode.prototype.addNodeBefore = function (before) {
            this._list.addNodeBefore(this, before);
        };
        LinkedListNode.prototype.addNodeAfter = function (after) {
            this._list.addNodeAfter(this, after);
        };
        LinkedListNode.prototype.remove = function () {
            this._list.removeNode(this);
        };
        return LinkedListNode;
    })();
});
//# sourceMappingURL=LinkedList.js.map