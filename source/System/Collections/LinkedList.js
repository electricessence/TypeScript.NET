/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Compare", "../Collections/Array/Utility", "./Enumeration/Enumerator", "./Enumeration/EnumeratorBase", "./LinkedNodeList", "../Exceptions/InvalidOperationException", "../Exceptions/ArgumentNullException"], factory);
    }
})(function (require, exports) {
    'use strict';
    var Values = require("../Compare");
    var ArrayUtility = require("../Collections/Array/Utility");
    var Enumerator = require("./Enumeration/Enumerator");
    var EnumeratorBase_1 = require("./Enumeration/EnumeratorBase");
    var LinkedNodeList_1 = require("./LinkedNodeList");
    var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
    var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
    var InternalNode = (function () {
        function InternalNode(value, previous, next) {
            this.value = value;
            this.previous = previous;
            this.next = next;
        }
        InternalNode.prototype.assertDetached = function () {
            if (this.next || this.previous)
                throw new InvalidOperationException_1.default("Adding a node that is already placed.");
        };
        return InternalNode;
    }());
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
        var n = node._nodeInternal;
        if (!n)
            throw new InvalidOperationException_1.default("Provided node is not valid.");
        return n;
    }
    var LinkedList = (function () {
        function LinkedList(source) {
            var _ = this, c = 0;
            var e = Enumerator.from(source);
            var list = _._listInternal = new LinkedNodeList_1.default();
            while (e.moveNext()) {
                list.addNode(new InternalNode(e.current));
                ++c;
            }
            _._count = c;
        }
        LinkedList.prototype.forEach = function (action, useCopy) {
            if (useCopy === void 0) { useCopy = false; }
            if (useCopy) {
                var array = this.toArray();
                ArrayUtility.forEach(array, action);
                array.length = 0;
            }
            else {
                this._listInternal.forEach(function (node, i) { return action(node.value, i); });
            }
        };
        LinkedList.prototype.getEnumerator = function () {
            var _ = this, current, next;
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
        };
        LinkedList.prototype._findFirst = function (entry) {
            var equals = Values.areEqual, next = this._listInternal.first;
            while (next) {
                if (equals(entry, next.value))
                    return next;
                next = next.next;
            }
            return null;
        };
        LinkedList.prototype._findLast = function (entry) {
            var equals = Values.areEqual, prev = this._listInternal.last;
            while (prev) {
                if (equals(entry, prev.value))
                    return prev;
                prev = prev.previous;
            }
            return null;
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
            this._listInternal.addNode(new InternalNode(entry));
            this._count++;
        };
        LinkedList.prototype.clear = function () {
            this._count = 0;
            return this._listInternal.clear();
        };
        LinkedList.prototype.contains = function (entry) {
            var found = false, equals = Values.areEqual;
            this.forEach(function (e) { return !(found = equals(entry, e)); });
            return found;
        };
        LinkedList.prototype.copyTo = function (array, index) {
            if (index === void 0) { index = 0; }
            if (!array)
                throw new ArgumentNullException_1.default('array');
            if (this._listInternal.first) {
                var minLength = index + this._count;
                if (array.length < minLength)
                    array.length = minLength;
                this.forEach(function (entry, i) {
                    array[index + i] = entry;
                });
            }
            return array;
        };
        LinkedList.prototype.toArray = function () {
            var array = ArrayUtility.initialize(this._count);
            return this.copyTo(array);
        };
        LinkedList.prototype.removeOnce = function (entry) {
            return this.remove(entry, 1) !== 0;
        };
        LinkedList.prototype.remove = function (entry, max) {
            if (max === void 0) { max = Infinity; }
            var equals = Values.areEqual;
            var _ = this, list = _._listInternal, removedCount = 0;
            list.forEach(function (node) {
                if (equals(entry, node.value) && list.removeNode(node)) {
                    --_._count;
                    ++removedCount;
                }
                return removedCount < max;
            });
            return removedCount;
        };
        Object.defineProperty(LinkedList.prototype, "first", {
            get: function () {
                return ensureExternal(this._listInternal.first, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "last", {
            get: function () {
                return ensureExternal(this._listInternal.last, this);
            },
            enumerable: true,
            configurable: true
        });
        LinkedList.prototype.getValueAt = function (index) {
            return this._listInternal.getNodeAt(index).value;
        };
        LinkedList.prototype.getNodeAt = function (index) {
            return ensureExternal(this._listInternal.getNodeAt(index), this);
        };
        LinkedList.prototype.find = function (entry) {
            return ensureExternal(this._findFirst(entry), this);
        };
        LinkedList.prototype.findLast = function (entry) {
            return ensureExternal(this._findLast(entry), this);
        };
        LinkedList.prototype.addFirst = function (entry) {
            this._listInternal.addNodeBefore(new InternalNode(entry));
            ++this._count;
        };
        LinkedList.prototype.addLast = function (entry) {
            this.add(entry);
        };
        LinkedList.prototype.removeFirst = function () {
            var _ = this, first = _._listInternal.first;
            if (first && _._listInternal.removeNode(first)) {
                _._count--;
            }
        };
        LinkedList.prototype.removeLast = function () {
            var _ = this, last = _._listInternal.last;
            if (last && _._listInternal.removeNode(last)) {
                --_._count;
            }
        };
        LinkedList.prototype.removeNode = function (node) {
            var _ = this, removed = _._listInternal.removeNode(getInternal(node, _));
            if (removed)
                --_._count;
            return removed;
        };
        LinkedList.prototype.addBefore = function (before, entry) {
            this._listInternal.addNodeBefore(new InternalNode(entry), getInternal(before, this));
            ++this._count;
        };
        LinkedList.prototype.addAfter = function (after, entry) {
            this._listInternal.addNodeAfter(new InternalNode(entry), getInternal(after, this));
            ++this._count;
        };
        LinkedList.prototype.addNodeBefore = function (node, before) {
            this._listInternal.addNodeBefore(getInternal(before, this), getInternal(node, this));
            ++this._count;
        };
        LinkedList.prototype.addNodeAfter = function (node, after) {
            this._listInternal.addNodeAfter(getInternal(after, this), getInternal(node, this));
            ++this._count;
        };
        return LinkedList;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LinkedList;
    var LinkedListNode = (function () {
        function LinkedListNode(_list, _nodeInternal) {
            this._list = _list;
            this._nodeInternal = _nodeInternal;
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
                return ensureExternal(this._nodeInternal.previous, this._list);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedListNode.prototype, "next", {
            get: function () {
                return ensureExternal(this._nodeInternal.next, this._list);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedListNode.prototype, "value", {
            get: function () {
                return this._nodeInternal.value;
            },
            set: function (v) {
                this._nodeInternal.value = v;
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
    }());
});
//# sourceMappingURL=LinkedList.js.map