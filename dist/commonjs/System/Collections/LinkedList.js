"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Compare_1 = require("../Compare");
var LinkedNodeList_1 = require("./LinkedNodeList");
var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var CollectionBase_1 = require("./CollectionBase");
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var VOID0 = void 0;
/*****************************
 * IMPORTANT NOTES ABOUT PERFORMANCE:
 * http://jsperf.com/simulating-a-queue
 *
 * Adding to an array is very fast, but modifying is slow.
 * LinkedList wins when modifying contents.
 * http://stackoverflow.com/questions/166884/array-versus-linked-list
 *****************************/
/*
 * An internal node is used to manage the order without exposing underlying link chain to the consumer.
 */
var InternalNode = /** @class */ (function () {
    function InternalNode(value, previous, next) {
        this.value = value;
        this.previous = previous;
        this.next = next;
    }
    InternalNode.prototype.assertDetached = function () {
        if (this.next || this.previous)
            throw new InvalidOperationException_1.InvalidOperationException("Adding a node that is already placed.");
        return true;
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
    return external || null;
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
var LinkedList = /** @class */ (function (_super) {
    __extends(LinkedList, _super);
    function LinkedList(source, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
        var _this = _super.call(this, VOID0, equalityComparer) || this;
        _this._listInternal = new LinkedNodeList_1.LinkedNodeList();
        _this._importEntries(source);
        return _this;
    }
    LinkedList.prototype.assertVersion = function (version) {
        if (this._listInternal)
            return this._listInternal.assertVersion(version);
        else // In case it's been disposed.
            return _super.prototype.assertVersion.call(this, version);
    };
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
        var _ = this, equals = _._equalityComparer, list = _._listInternal;
        var removedCount = 0;
        list.forEach(function (node) {
            if (node && equals(entry, node.value) && _._removeNodeInternal(node))
                removedCount++;
            return removedCount < max;
        }, true /* override versioning check */);
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
    // #endregion
    // #region IEnumerable<T>
    LinkedList.prototype.getEnumerator = function () {
        this.throwIfDisposed();
        return LinkedNodeList_1.LinkedNodeList.valueEnumeratorFrom(this._listInternal);
    };
    // #endregion
    LinkedList.prototype._findFirst = function (entry) {
        //noinspection UnnecessaryLocalVariableJS
        var _ = this, equals = _._equalityComparer;
        var next = _._listInternal && _._listInternal.first;
        while (next) {
            if (equals(entry, next.value))
                return next;
            next = next.next;
        }
        return null;
    };
    LinkedList.prototype._findLast = function (entry) {
        //noinspection UnnecessaryLocalVariableJS
        var _ = this, equals = _._equalityComparer;
        var prev = _._listInternal && _._listInternal.last;
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
    // get methods are available for convenience but is an n*index operation.
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
        return this;
    };
    LinkedList.prototype.addLast = function (entry) {
        return this.add(entry);
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
    // Returns true if successful and false if not found (already removed).
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
        return this;
    };
    LinkedList.prototype.addAfter = function (after, entry) {
        var _ = this;
        _.assertModifiable();
        _._listInternal.addNodeAfter(new InternalNode(entry), getInternal(after, _));
        _._signalModification(true);
        return this;
    };
    return LinkedList;
}(CollectionBase_1.CollectionBase));
exports.LinkedList = LinkedList;
// Use an internal node class to prevent mucking up the LinkedList.
var LinkedListNode = /** @class */ (function () {
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
        return this;
    };
    LinkedListNode.prototype.addAfter = function (entry) {
        this.throwIfDetached();
        this._list.addAfter(this, entry);
        return this;
    };
    LinkedListNode.prototype.remove = function () {
        var _ = this;
        var list = _._list;
        if (list)
            list.removeNode(this);
        _._list = VOID0;
        _._nodeInternal = VOID0;
    };
    LinkedListNode.prototype.dispose = function () {
        this.remove();
    };
    return LinkedListNode;
}());
exports.default = LinkedList;
//# sourceMappingURL=LinkedList.js.map