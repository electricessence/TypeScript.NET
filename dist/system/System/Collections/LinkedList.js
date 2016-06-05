/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../Compare", "./LinkedNodeList", "../Exceptions/InvalidOperationException", "../Exceptions/ArgumentNullException", "./CollectionBase", "../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Compare_1, LinkedNodeList_1, InvalidOperationException_1, ArgumentNullException_1, CollectionBase_1, extends_1;
    var __extends, InternalNode, LinkedList, LinkedListNode;
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
    return {
        setters:[
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            },
            function (LinkedNodeList_1_1) {
                LinkedNodeList_1 = LinkedNodeList_1_1;
            },
            function (InvalidOperationException_1_1) {
                InvalidOperationException_1 = InvalidOperationException_1_1;
            },
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (CollectionBase_1_1) {
                CollectionBase_1 = CollectionBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            InternalNode = (function () {
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
            LinkedList = (function (_super) {
                __extends(LinkedList, _super);
                function LinkedList(source, equalityComparer) {
                    if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
                    _super.call(this, null, equalityComparer);
                    var _ = this;
                    _._listInternal = new LinkedNodeList_1.LinkedNodeList();
                    _._importEntries(source);
                }
                LinkedList.prototype.getCount = function () {
                    return this._listInternal.unsafeCount;
                };
                LinkedList.prototype._addInternal = function (entry) {
                    this._listInternal.addNode(new InternalNode(entry));
                    return true;
                };
                LinkedList.prototype._removeInternal = function (entry, max) {
                    if (max === void 0) { max = Infinity; }
                    var _ = this, equals = _._equalityComparer, list = _._listInternal, removedCount = 0;
                    list.forEach(function (node) {
                        if (equals(entry, node.value) && list.removeNode(node))
                            removedCount++;
                        return removedCount < max;
                    });
                    return removedCount;
                };
                LinkedList.prototype._clearInternal = function () {
                    return this._listInternal.clear();
                };
                LinkedList.prototype.forEach = function (action, useCopy) {
                    if (useCopy === void 0) { useCopy = false; }
                    return useCopy
                        ? _super.prototype.forEach.call(this, action, useCopy)
                        : this._listInternal.forEach(function (node, i) { return action(node.value, i); });
                };
                LinkedList.prototype.getEnumerator = function () {
                    return LinkedNodeList_1.LinkedNodeList.valueEnumeratorFrom(this._listInternal);
                };
                LinkedList.prototype._findFirst = function (entry) {
                    var _ = this, equals = _._equalityComparer, next = _._listInternal.first;
                    while (next) {
                        if (equals(entry, next.value))
                            return next;
                        next = next.next;
                    }
                    return null;
                };
                LinkedList.prototype._findLast = function (entry) {
                    var _ = this, equals = _._equalityComparer, prev = _._listInternal.last;
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
                    var node = this._listInternal.getNodeAt(index);
                    if (!node)
                        return node && node.value || void (0);
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
                    this._signalModification(true);
                };
                LinkedList.prototype.addLast = function (entry) {
                    this.add(entry);
                };
                LinkedList.prototype.removeFirst = function () {
                    var _ = this, first = _._listInternal.first;
                    if (first && _._listInternal.removeNode(first))
                        _._signalModification(true);
                };
                LinkedList.prototype.removeLast = function () {
                    var _ = this, last = _._listInternal.last;
                    if (last && _._listInternal.removeNode(last))
                        _._signalModification(true);
                };
                LinkedList.prototype.removeNode = function (node) {
                    var _ = this;
                    if (_._listInternal.removeNode(getInternal(node, _))) {
                        _._signalModification(true);
                        return true;
                    }
                    return false;
                };
                LinkedList.prototype.addBefore = function (before, entry) {
                    var _ = this;
                    _._listInternal.addNodeBefore(new InternalNode(entry), getInternal(before, _));
                    _._signalModification(true);
                };
                LinkedList.prototype.addAfter = function (after, entry) {
                    var _ = this;
                    _._listInternal.addNodeAfter(new InternalNode(entry), getInternal(after, _));
                    _._signalModification(true);
                };
                LinkedList.prototype.addNodeBefore = function (node, before) {
                    var _ = this;
                    _._listInternal.addNodeBefore(getInternal(before, _), getInternal(node, _));
                    _._signalModification(true);
                };
                LinkedList.prototype.addNodeAfter = function (node, after) {
                    var _ = this;
                    this._listInternal.addNodeAfter(getInternal(after, _), getInternal(node, _));
                    _._signalModification(true);
                };
                return LinkedList;
            }(CollectionBase_1.CollectionBase));
            exports_1("LinkedList", LinkedList);
            LinkedListNode = (function () {
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
            exports_1("default",LinkedList);
        }
    }
});
//# sourceMappingURL=LinkedList.js.map