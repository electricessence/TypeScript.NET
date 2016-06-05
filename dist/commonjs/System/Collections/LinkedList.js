/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Compare_1 = require("../Compare");
var LinkedNodeList_1 = require("./LinkedNodeList");
var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var CollectionBase_1 = require("./CollectionBase");
var extends_1 = require("../../extends");
var __extends = extends_1.default;
var VOID0 = void 0;
var InternalNode = (function () {
    function InternalNode(value, previous, next) {
        this.value = value;
        this.previous = previous;
        this.next = next;
    }
    InternalNode.prototype.assertDetached = function () {
        if (this.next || this.previous)
            throw new InvalidOperationException_1.InvalidOperationException("Adding a node that is already placed.");
    };
    return InternalNode;
}());
function ensureExternal(node, list) {
    if (!node)
        return null;
    if (!list)
        throw new ArgumentNullException_1.ArgumentNullException("list");
    var external = node.external;
    if (!external)
        node.external = external = new LinkedListNode(list, node);
    return external;
}
function getInternal(node, list) {
    if (!node)
        throw new ArgumentNullException_1.ArgumentNullException("node");
    if (!list)
        throw new ArgumentNullException_1.ArgumentNullException("list");
    if (node.list != list)
        throw new InvalidOperationException_1.InvalidOperationException("Provided node does not belong to this list.");
    var n = node._nodeInternal;
    if (!n)
        throw new InvalidOperationException_1.InvalidOperationException("Provided node is not valid.");
    return n;
}
function detachExternal(node) {
    if (node) {
        var e = node.external;
        if (e) {
            e._list = VOID0;
            e._nodeInternal = VOID0;
        }
        node.external = VOID0;
    }
}
var LinkedList = (function (_super) {
    __extends(LinkedList, _super);
    function LinkedList(source, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
        _super.call(this, null, equalityComparer);
        var _ = this;
        _._listInternal = new LinkedNodeList_1.LinkedNodeList();
        _._importEntries(source);
    }
    LinkedList.prototype._onDispose = function () {
        _super.prototype._onDispose.call(this);
        var l = this._listInternal;
        this._listInternal = null;
        l.dispose();
    };
    LinkedList.prototype.getCount = function () {
        var li = this._listInternal;
        return li ? li.unsafeCount : 0;
    };
    LinkedList.prototype._addInternal = function (entry) {
        this._listInternal.addNode(new InternalNode(entry));
        return true;
    };
    LinkedList.prototype._removeInternal = function (entry, max) {
        if (max === void 0) { max = Infinity; }
        var _ = this, equals = _._equalityComparer, list = _._listInternal, removedCount = 0;
        list.forEach(function (node) {
            if (equals(entry, node.value) && _._removeNodeInternal(node))
                removedCount++;
            return removedCount < max;
        });
        return removedCount;
    };
    LinkedList.prototype._clearInternal = function () {
        var list = this._listInternal;
        list.forEach(function (node) { return detachExternal(node); });
        return list.clear();
    };
    LinkedList.prototype.forEach = function (action, useCopy) {
        if (useCopy === void 0) { useCopy = false; }
        this.throwIfDisposed();
        return useCopy
            ? _super.prototype.forEach.call(this, action, useCopy)
            : this._listInternal.forEach(function (node, i) { return action(node.value, i); });
    };
    LinkedList.prototype.getEnumerator = function () {
        this.throwIfDisposed();
        return LinkedNodeList_1.LinkedNodeList.valueEnumeratorFrom(this._listInternal);
    };
    LinkedList.prototype._findFirst = function (entry) {
        var _ = this, equals = _._equalityComparer, next = _._listInternal && _._listInternal.first;
        while (next) {
            if (equals(entry, next.value))
                return next;
            next = next.next;
        }
        return null;
    };
    LinkedList.prototype._findLast = function (entry) {
        var _ = this, equals = _._equalityComparer, prev = _._listInternal && _._listInternal.last;
        while (prev) {
            if (equals(entry, prev.value))
                return prev;
            prev = prev.previous;
        }
        return null;
    };
    LinkedList.prototype.removeOnce = function (entry) {
        return this.remove(entry, 1) !== 0;
    };
    Object.defineProperty(LinkedList.prototype, "first", {
        get: function () {
            var li = this._listInternal;
            return li && ensureExternal(li.first, this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkedList.prototype, "firstValue", {
        get: function () {
            var li = this._listInternal, node = li && li.first;
            return node ? node.value : VOID0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkedList.prototype, "last", {
        get: function () {
            var li = this._listInternal;
            return ensureExternal(li.last, this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkedList.prototype, "lastValue", {
        get: function () {
            var li = this._listInternal, node = li && li.last;
            return node ? node.value : VOID0;
        },
        enumerable: true,
        configurable: true
    });
    LinkedList.prototype.getValueAt = function (index) {
        var li = this._listInternal, node = li && li.getNodeAt(index);
        return node ? node.value : VOID0;
    };
    LinkedList.prototype.getNodeAt = function (index) {
        var li = this._listInternal;
        return li && ensureExternal(li.getNodeAt(index), this);
    };
    LinkedList.prototype.find = function (entry) {
        var li = this._listInternal;
        return li && ensureExternal(this._findFirst(entry), this);
    };
    LinkedList.prototype.findLast = function (entry) {
        var li = this._listInternal;
        return li && ensureExternal(this._findLast(entry), this);
    };
    LinkedList.prototype.addFirst = function (entry) {
        this.assertModifiable();
        this._listInternal.addNodeBefore(new InternalNode(entry));
        this._signalModification(true);
    };
    LinkedList.prototype.addLast = function (entry) {
        this.add(entry);
    };
    LinkedList.prototype._removeNodeInternal = function (node) {
        var _ = this;
        if (node && _._listInternal.removeNode(node)) {
            detachExternal(node);
            _._signalModification(true);
            return true;
        }
        return false;
    };
    LinkedList.prototype.removeFirst = function () {
        var _ = this;
        _.assertModifiable();
        return _._removeNodeInternal(_._listInternal.first);
    };
    LinkedList.prototype.removeLast = function () {
        var _ = this;
        _.assertModifiable();
        return _._removeNodeInternal(_._listInternal.last);
    };
    LinkedList.prototype.removeAt = function (index) {
        var _ = this;
        _.assertModifiable();
        return _._removeNodeInternal(_._listInternal.getNodeAt(index));
    };
    LinkedList.prototype.removeNode = function (node) {
        var _ = this;
        _.assertModifiable();
        return _._removeNodeInternal(getInternal(node, _));
    };
    LinkedList.prototype.addBefore = function (before, entry) {
        var _ = this;
        _.assertModifiable();
        _._listInternal.addNodeBefore(new InternalNode(entry), getInternal(before, _));
        _._signalModification(true);
    };
    LinkedList.prototype.addAfter = function (after, entry) {
        var _ = this;
        _.assertModifiable();
        _._listInternal.addNodeAfter(new InternalNode(entry), getInternal(after, _));
        _._signalModification(true);
    };
    return LinkedList;
}(CollectionBase_1.CollectionBase));
exports.LinkedList = LinkedList;
var LinkedListNode = (function () {
    function LinkedListNode(_list, _nodeInternal) {
        this._list = _list;
        this._nodeInternal = _nodeInternal;
    }
    LinkedListNode.prototype.throwIfDetached = function () {
        if (!this._list)
            throw new Error("This node has been detached from its list and is no longer valid.");
    };
    Object.defineProperty(LinkedListNode.prototype, "list", {
        get: function () {
            return this._list;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkedListNode.prototype, "previous", {
        get: function () {
            this.throwIfDetached();
            return ensureExternal(this._nodeInternal.previous, this._list);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkedListNode.prototype, "next", {
        get: function () {
            this.throwIfDetached();
            return ensureExternal(this._nodeInternal.next, this._list);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkedListNode.prototype, "value", {
        get: function () {
            this.throwIfDetached();
            return this._nodeInternal.value;
        },
        set: function (v) {
            this.throwIfDetached();
            this._nodeInternal.value = v;
        },
        enumerable: true,
        configurable: true
    });
    LinkedListNode.prototype.addBefore = function (entry) {
        this.throwIfDetached();
        this._list.addBefore(this, entry);
    };
    LinkedListNode.prototype.addAfter = function (entry) {
        this.throwIfDetached();
        this._list.addAfter(this, entry);
    };
    LinkedListNode.prototype.remove = function () {
        var list = this._list;
        if (list)
            list.removeNode(this);
        this._list = VOID0;
        this._nodeInternal = VOID0;
    };
    LinkedListNode.prototype.dispose = function () {
        this.remove();
    };
    return LinkedListNode;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinkedList;
//# sourceMappingURL=LinkedList.js.map