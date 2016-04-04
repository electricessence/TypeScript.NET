/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import * as Values from "../Compare";
import * as ArrayUtility from "../Collections/Array/Utility";
import * as Enumerator from "./Enumeration/Enumerator";
import EnumeratorBase from "./Enumeration/EnumeratorBase";
import LinkedNodeList from "./LinkedNodeList";
import InvalidOperationException from "../Exceptions/InvalidOperationException";
import ArgumentNullException from "../Exceptions/ArgumentNullException";
class InternalNode {
    constructor(value, previous, next) {
        this.value = value;
        this.previous = previous;
        this.next = next;
    }
    assertDetached() {
        if (this.next || this.previous)
            throw new InvalidOperationException("Adding a node that is already placed.");
    }
}
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
        throw new ArgumentNullException("Cannot be null.");
    if (node.list != list)
        throw new InvalidOperationException("Provided node does not belong to this list.");
    var n = node._node;
    if (!n)
        throw new InvalidOperationException("Provided node is not valid.");
    return n;
}
export default class LinkedList {
    constructor(source) {
        var _ = this, c = 0;
        var e = Enumerator.from(source);
        var list = _._listInternal = new LinkedNodeList();
        while (e.moveNext()) {
            list.addNode(new InternalNode(e.current));
            ++c;
        }
        _._count = c;
    }
    forEach(action, useCopy = false) {
        if (useCopy) {
            var array = this.toArray();
            ArrayUtility.forEach(array, action);
            array.length = 0;
        }
        else {
            this._listInternal.forEach((node, i) => action(node.value, i));
        }
    }
    getEnumerator() {
        var _ = this, current, next;
        return new EnumeratorBase(() => {
            current = null;
            next = _._listInternal.first;
        }, (yielder) => {
            if (next) {
                current = next;
                next = current && current.next;
                return yielder.yieldReturn(current.value);
            }
            return yielder.yieldBreak();
        });
    }
    _findFirst(entry) {
        var equals = Values.areEqual, next = this._listInternal.first;
        while (next) {
            if (equals(entry, next.value))
                return next;
            next = next.next;
        }
        return null;
    }
    _findLast(entry) {
        var equals = Values.areEqual, prev = this._listInternal.last;
        while (prev) {
            if (equals(entry, prev.value))
                return prev;
            prev = prev.previous;
        }
        return null;
    }
    get count() {
        return this._count;
    }
    get isReadOnly() {
        return false;
    }
    add(entry) {
        this._listInternal.addNode(new InternalNode(entry));
        this._count++;
    }
    clear() {
        this._count = 0;
        return this._listInternal.clear();
    }
    contains(entry) {
        var found = false, equals = Values.areEqual;
        this.forEach(e => !(found = equals(entry, e)));
        return found;
    }
    copyTo(array, index = 0) {
        if (!array)
            throw new ArgumentNullException('array');
        if (this._listInternal.first) {
            var minLength = index + this._count;
            if (array.length < minLength)
                array.length = minLength;
            this.forEach((entry, i) => {
                array[index + i] = entry;
            });
        }
        return array;
    }
    toArray() {
        var array = ArrayUtility.initialize(this._count);
        return this.copyTo(array);
    }
    removeOnce(entry) {
        return this.remove(entry, 1) !== 0;
    }
    remove(entry, max = Infinity) {
        var equals = Values.areEqual;
        var _ = this, list = _._listInternal, removedCount = 0;
        list.forEach(node => {
            if (equals(entry, node.value) && list.removeNode(node)) {
                --_._count;
                ++removedCount;
            }
            return removedCount < max;
        });
        return removedCount;
    }
    get first() {
        return ensureExternal(this._listInternal.first, this);
    }
    get last() {
        return ensureExternal(this._listInternal.last, this);
    }
    getValueAt(index) {
        return this._listInternal.getNodeAt(index).value;
    }
    getNodeAt(index) {
        return ensureExternal(this._listInternal.getNodeAt(index), this);
    }
    find(entry) {
        return ensureExternal(this._findFirst(entry), this);
    }
    findLast(entry) {
        return ensureExternal(this._findLast(entry), this);
    }
    addFirst(entry) {
        this._listInternal.addNodeBefore(new InternalNode(entry));
        ++this._count;
    }
    addLast(entry) {
        this.add(entry);
    }
    removeFirst() {
        var _ = this, first = _._listInternal.first;
        if (first && _._listInternal.removeNode(first)) {
            _._count--;
        }
    }
    removeLast() {
        var _ = this, last = _._listInternal.last;
        if (last && _._listInternal.removeNode(last)) {
            --_._count;
        }
    }
    removeNode(node) {
        var _ = this, removed = _._listInternal.removeNode(getInternal(node, _));
        if (removed)
            --_._count;
        return removed;
    }
    addBefore(before, entry) {
        this._listInternal.addNodeBefore(new InternalNode(entry), getInternal(before, this));
        ++this._count;
    }
    addAfter(after, entry) {
        this._listInternal.addNodeAfter(new InternalNode(entry), getInternal(after, this));
        ++this._count;
    }
    addNodeBefore(node, before) {
        this._listInternal.addNodeBefore(getInternal(before, this), getInternal(node, this));
        ++this._count;
    }
    addNodeAfter(node, after) {
        this._listInternal.addNodeAfter(getInternal(after, this), getInternal(node, this));
        ++this._count;
    }
}
class LinkedListNode {
    constructor(_list, _nodeInternal) {
        this._list = _list;
        this._nodeInternal = _nodeInternal;
    }
    get list() {
        return this._list;
    }
    get previous() {
        return ensureExternal(this._nodeInternal.previous, this._list);
    }
    get next() {
        return ensureExternal(this._nodeInternal.next, this._list);
    }
    get value() {
        return this._nodeInternal.value;
    }
    set value(v) {
        this._nodeInternal.value = v;
    }
    addBefore(entry) {
        this._list.addBefore(this, entry);
    }
    addAfter(entry) {
        this._list.addAfter(this, entry);
    }
    addNodeBefore(before) {
        this._list.addNodeBefore(this, before);
    }
    addNodeAfter(after) {
        this._list.addNodeAfter(this, after);
    }
    remove() {
        this._list.removeNode(this);
    }
}
//# sourceMappingURL=LinkedList.js.map