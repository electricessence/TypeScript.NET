/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual } from "../Compare";
import { LinkedNodeList } from "./LinkedNodeList";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { CollectionBase } from "./CollectionBase";
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
    if (!list)
        throw new ArgumentNullException("list");
    var external = node.external;
    if (!external)
        node.external = external = new LinkedListNode(list, node);
    return external;
}
function getInternal(node, list) {
    if (!node)
        throw new ArgumentNullException("node");
    if (!list)
        throw new ArgumentNullException("list");
    if (node.list != list)
        throw new InvalidOperationException("Provided node does not belong to this list.");
    var n = node._nodeInternal;
    if (!n)
        throw new InvalidOperationException("Provided node is not valid.");
    return n;
}
export class LinkedList extends CollectionBase {
    constructor(source, equalityComparer = areEqual) {
        super(null, equalityComparer);
        var _ = this;
        _._listInternal = new LinkedNodeList();
        _._importEntries(source);
    }
    getCount() {
        return this._listInternal.unsafeCount;
    }
    _addInternal(entry) {
        this._listInternal.addNode(new InternalNode(entry));
        return true;
    }
    _removeInternal(entry, max = Infinity) {
        var _ = this, equals = _._equalityComparer, list = _._listInternal, removedCount = 0;
        list.forEach(node => {
            if (equals(entry, node.value) && list.removeNode(node))
                removedCount++;
            return removedCount < max;
        });
        return removedCount;
    }
    _clearInternal() {
        return this._listInternal.clear();
    }
    forEach(action, useCopy = false) {
        return useCopy
            ? super.forEach(action, useCopy)
            : this._listInternal.forEach((node, i) => action(node.value, i));
    }
    getEnumerator() {
        return LinkedNodeList.valueEnumeratorFrom(this._listInternal);
    }
    _findFirst(entry) {
        var _ = this, equals = _._equalityComparer, next = _._listInternal.first;
        while (next) {
            if (equals(entry, next.value))
                return next;
            next = next.next;
        }
        return null;
    }
    _findLast(entry) {
        var _ = this, equals = _._equalityComparer, prev = _._listInternal.last;
        while (prev) {
            if (equals(entry, prev.value))
                return prev;
            prev = prev.previous;
        }
        return null;
    }
    removeOnce(entry) {
        return this.remove(entry, 1) !== 0;
    }
    get first() {
        return ensureExternal(this._listInternal.first, this);
    }
    get last() {
        return ensureExternal(this._listInternal.last, this);
    }
    getValueAt(index) {
        var node = this._listInternal.getNodeAt(index);
        if (!node)
            return node && node.value || void (0);
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
        this._signalModification(true);
    }
    addLast(entry) {
        this.add(entry);
    }
    removeFirst() {
        var _ = this, first = _._listInternal.first;
        if (first && _._listInternal.removeNode(first))
            _._signalModification(true);
    }
    removeLast() {
        var _ = this, last = _._listInternal.last;
        if (last && _._listInternal.removeNode(last))
            _._signalModification(true);
    }
    removeNode(node) {
        var _ = this;
        if (_._listInternal.removeNode(getInternal(node, _))) {
            _._signalModification(true);
            return true;
        }
        return false;
    }
    addBefore(before, entry) {
        var _ = this;
        _._listInternal.addNodeBefore(new InternalNode(entry), getInternal(before, _));
        _._signalModification(true);
    }
    addAfter(after, entry) {
        var _ = this;
        _._listInternal.addNodeAfter(new InternalNode(entry), getInternal(after, _));
        _._signalModification(true);
    }
    addNodeBefore(node, before) {
        var _ = this;
        _._listInternal.addNodeBefore(getInternal(before, _), getInternal(node, _));
        _._signalModification(true);
    }
    addNodeAfter(node, after) {
        var _ = this;
        this._listInternal.addNodeAfter(getInternal(after, _), getInternal(node, _));
        _._signalModification(true);
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
export default LinkedList;
//# sourceMappingURL=LinkedList.js.map