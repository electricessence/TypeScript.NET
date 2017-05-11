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
// noinspection JSUnusedLocalSymbols
const VOID0 = void 0;
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
class InternalNode {
    constructor(value, previous, next) {
        this.value = value;
        this.previous = previous;
        this.next = next;
    }
    assertDetached() {
        if (this.next || this.previous)
            throw new InvalidOperationException("Adding a node that is already placed.");
        return true;
    }
}
function ensureExternal(node, list) {
    if (!node)
        return null;
    if (!list)
        throw new ArgumentNullException("list");
    let external = node.external;
    if (!external)
        node.external = external = new LinkedListNode(list, node);
    return external || null;
}
function getInternal(node, list) {
    if (!node)
        throw new ArgumentNullException("node");
    if (!list)
        throw new ArgumentNullException("list");
    if (node.list != list)
        throw new InvalidOperationException("Provided node does not belong to this list.");
    let n = node._nodeInternal;
    if (!n)
        throw new InvalidOperationException("Provided node is not valid.");
    return n;
}
function detachExternal(node) {
    if (node) {
        const e = node.external;
        if (e) {
            e._list = VOID0;
            e._nodeInternal = VOID0;
        }
        node.external = VOID0;
    }
}
export class LinkedList extends CollectionBase {
    constructor(source, equalityComparer = areEqual) {
        super(VOID0, equalityComparer);
        this._listInternal = new LinkedNodeList();
        this._importEntries(source);
    }
    assertVersion(version) {
        if (this._listInternal)
            return this._listInternal.assertVersion(version);
        else
            return super.assertVersion(version);
    }
    _onDispose() {
        super._onDispose();
        const l = this._listInternal;
        this._listInternal = null;
        l.dispose();
    }
    getCount() {
        const li = this._listInternal;
        return li ? li.unsafeCount : 0;
    }
    _addInternal(entry) {
        this._listInternal.addNode(new InternalNode(entry));
        return true;
    }
    _removeInternal(entry, max = Infinity) {
        const _ = this, equals = _._equalityComparer, list = _._listInternal;
        let removedCount = 0;
        list.forEach(node => {
            if (node && equals(entry, node.value) && _._removeNodeInternal(node))
                removedCount++;
            return removedCount < max;
        }, true /* override versioning check */);
        return removedCount;
    }
    _clearInternal() {
        const list = this._listInternal;
        list.forEach(node => detachExternal(node));
        return list.clear();
    }
    forEach(action, useCopy = false) {
        this.throwIfDisposed();
        return useCopy
            ? super.forEach(action, useCopy)
            : this._listInternal.forEach((node, i) => action(node.value, i));
    }
    // #endregion
    // #region IEnumerable<T>
    getEnumerator() {
        this.throwIfDisposed();
        return LinkedNodeList.valueEnumeratorFrom(this._listInternal);
    }
    // #endregion
    _findFirst(entry) {
        //noinspection UnnecessaryLocalVariableJS
        const _ = this, equals = _._equalityComparer;
        let next = _._listInternal && _._listInternal.first;
        while (next) {
            if (equals(entry, next.value))
                return next;
            next = next.next;
        }
        return null;
    }
    _findLast(entry) {
        //noinspection UnnecessaryLocalVariableJS
        const _ = this, equals = _._equalityComparer;
        let prev = _._listInternal && _._listInternal.last;
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
        const li = this._listInternal;
        return li && ensureExternal(li.first, this);
    }
    get firstValue() {
        const li = this._listInternal, node = li && li.first;
        return node ? node.value : VOID0;
    }
    get last() {
        const li = this._listInternal;
        return ensureExternal(li.last, this);
    }
    get lastValue() {
        const li = this._listInternal, node = li && li.last;
        return node ? node.value : VOID0;
    }
    // get methods are available for convenience but is an n*index operation.
    getValueAt(index) {
        const li = this._listInternal, node = li && li.getNodeAt(index);
        return node ? node.value : VOID0;
    }
    getNodeAt(index) {
        const li = this._listInternal;
        return li && ensureExternal(li.getNodeAt(index), this);
    }
    find(entry) {
        const li = this._listInternal;
        return li && ensureExternal(this._findFirst(entry), this);
    }
    findLast(entry) {
        const li = this._listInternal;
        return li && ensureExternal(this._findLast(entry), this);
    }
    addFirst(entry) {
        this.assertModifiable();
        this._listInternal.addNodeBefore(new InternalNode(entry));
        this._signalModification(true);
        return this;
    }
    addLast(entry) {
        return this.add(entry);
    }
    _removeNodeInternal(node) {
        const _ = this;
        if (node && _._listInternal.removeNode(node)) {
            detachExternal(node);
            _._signalModification(true);
            return true;
        }
        return false;
    }
    removeFirst() {
        const _ = this;
        _.assertModifiable();
        return _._removeNodeInternal(_._listInternal.first);
    }
    removeLast() {
        const _ = this;
        _.assertModifiable();
        return _._removeNodeInternal(_._listInternal.last);
    }
    removeAt(index) {
        const _ = this;
        _.assertModifiable();
        return _._removeNodeInternal(_._listInternal.getNodeAt(index));
    }
    // Returns true if successful and false if not found (already removed).
    removeNode(node) {
        const _ = this;
        _.assertModifiable();
        return _._removeNodeInternal(getInternal(node, _));
    }
    addBefore(before, entry) {
        const _ = this;
        _.assertModifiable();
        _._listInternal.addNodeBefore(new InternalNode(entry), getInternal(before, _));
        _._signalModification(true);
        return this;
    }
    addAfter(after, entry) {
        const _ = this;
        _.assertModifiable();
        _._listInternal.addNodeAfter(new InternalNode(entry), getInternal(after, _));
        _._signalModification(true);
        return this;
    }
}
// Use an internal node class to prevent mucking up the LinkedList.
class LinkedListNode {
    constructor(_list, _nodeInternal) {
        this._list = _list;
        this._nodeInternal = _nodeInternal;
    }
    throwIfDetached() {
        if (!this._list)
            throw new Error("This node has been detached from its list and is no longer valid.");
    }
    get list() {
        return this._list;
    }
    get previous() {
        this.throwIfDetached();
        return ensureExternal(this._nodeInternal.previous, this._list);
    }
    get next() {
        this.throwIfDetached();
        return ensureExternal(this._nodeInternal.next, this._list);
    }
    get value() {
        this.throwIfDetached();
        return this._nodeInternal.value;
    }
    set value(v) {
        this.throwIfDetached();
        this._nodeInternal.value = v;
    }
    addBefore(entry) {
        this.throwIfDetached();
        this._list.addBefore(this, entry);
        return this;
    }
    addAfter(entry) {
        this.throwIfDetached();
        this._list.addAfter(this, entry);
        return this;
    }
    remove() {
        const _ = this;
        const list = _._list;
        if (list)
            list.removeNode(this);
        _._list = VOID0;
        _._nodeInternal = VOID0;
    }
    dispose() {
        this.remove();
    }
}
export default LinkedList;
//# sourceMappingURL=LinkedList.js.map