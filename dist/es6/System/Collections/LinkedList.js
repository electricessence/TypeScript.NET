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
import __extendsImport from "../../extends";
const __extends = __extendsImport;
const VOID0 = void 0;
class InternalNode {
    constructor(value, previous = null, next = null) {
        this.value = value;
        this.previous = previous;
        this.next = next;
    }
    assertDetached() {
        if (this.next || this.previous)
            throw new InvalidOperationException("Adding a node that is already placed.");
    }
}
null;
{
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
export class LinkedList extends CollectionBase {
    constructor(source, equalityComparer = areEqual) {
        super(VOID0, equalityComparer);
        const _ = this;
        _._listInternal = new LinkedNodeList();
        _._importEntries(source);
    }
    _onDispose() {
        super._onDispose();
        var l = this._listInternal;
        this._listInternal = null;
        l.dispose();
    }
    getCount() {
        var li = this._listInternal;
        return li ? li.unsafeCount : 0;
    }
    _addInternal(entry) {
        this._listInternal.addNode(new InternalNode(entry));
        return true;
    }
    _removeInternal(entry, max = Infinity) {
        var _ = this, equals = _._equalityComparer, list = _._listInternal, removedCount = 0;
        list.forEach(node => {
            if (node && equals(entry, node.value) && _._removeNodeInternal(node))
                removedCount++;
            return removedCount < max;
        });
        return removedCount;
    }
    _clearInternal() {
        var list = this._listInternal;
        list.forEach(node => detachExternal(node));
        return list.clear();
    }
    forEach(action, useCopy = false) {
        this.throwIfDisposed();
        return useCopy
            ? super.forEach(action, useCopy)
            : this._listInternal.forEach((node, i) => action(node.value, i));
    }
    getEnumerator() {
        this.throwIfDisposed();
        return LinkedNodeList.valueEnumeratorFrom(this._listInternal);
    }
    _findFirst(entry) { }
}
{
    const _ = this, equals = _._equalityComparer;
    var next = _._listInternal && _._listInternal.first;
    while (next) {
        if (equals(entry, next.value))
            return next;
        next = next.next;
    }
    return null;
}
_findLast(entry, T);
InternalNode( | null, {
    const: _ = this,
    equals = _._equalityComparer,
    var: prev, any = _._listInternal && _._listInternal.last,
    while(prev) {
        if (equals(entry, prev.value))
            return prev;
        prev = prev.previous;
    },
    return: null
}, removeOnce(entry, T), boolean, {
    return: this.remove(entry, 1) !== 0
}, get, first(), ILinkedListNode( | null, {
    var: li = this._listInternal,
    return: li && ensureExternal(li.first, this)
}, get, firstValue(), T, {
    var: li = this._listInternal, node = li && li.first,
    return: node ? node.value : VOID0
}, get, last(), ILinkedListNode( | null, {
    var: li = this._listInternal,
    return: ensureExternal(li.last, this)
}, get, lastValue(), T, {
    var: li = this._listInternal, node = li && li.last,
    return: node ? node.value : VOID0
}, getValueAt(index, number), T, {
    var: li = this._listInternal, node = li && li.getNodeAt(index),
    return: node ? node.value : VOID0
}, getNodeAt(index, number), ILinkedListNode( | null, {
    var: li = this._listInternal,
    return: li && ensureExternal(li.getNodeAt(index), this)
}, find(entry, T), ILinkedListNode( | null, {
    var: li = this._listInternal,
    return: li && ensureExternal(this._findFirst(entry), this)
}, findLast(entry, T), ILinkedListNode( | null, {
    var: li = this._listInternal,
    return: li && ensureExternal(this._findLast(entry), this)
}, addFirst(entry, T), void {
    this: .assertModifiable(),
    this: ._listInternal.addNodeBefore(new InternalNode(entry)),
    this: ._signalModification(true)
}, addLast(entry, T), void {
    this: .add(entry)
}, private, _removeNodeInternal(node, InternalNode( | null | undefined), boolean, {
    const: _ = this,
    if(node =  && _._listInternal.removeNode(node)) {
        detachExternal(node);
        _._signalModification(true);
        return true;
    },
    return: false
}, removeFirst(), boolean, {
    const: _ = this,
    _: .assertModifiable(),
    return: _._removeNodeInternal(_._listInternal.first)
}, removeLast(), boolean, {
    const: _ = this,
    _: .assertModifiable(),
    return: _._removeNodeInternal(_._listInternal.last)
}, removeAt(index, number), boolean, {
    const: _ = this,
    _: .assertModifiable(),
    return: _._removeNodeInternal(_._listInternal.getNodeAt(index))
}, removeNode(node, ILinkedListNode(), boolean, {
    const: _ = this,
    _: .assertModifiable(),
    return: _._removeNodeInternal(getInternal(node, _))
}, addBefore(before, ILinkedListNode < T > , entry, T), void {
    const: _ = this,
    _: .assertModifiable(),
    _: ._listInternal.addNodeBefore(new InternalNode(entry), getInternal(before, _)),
    _: ._signalModification(true)
}, addAfter(after, ILinkedListNode < T > , entry, T), void {
    const: _ = this,
    _: .assertModifiable(),
    _: ._listInternal.addNodeAfter(new InternalNode(entry), getInternal(after, _)),
    _: ._signalModification(true)
}, class LinkedListNode {
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
    get previous() { }
}
, {
    this: .throwIfDetached(),
    return: ensureExternal(this._nodeInternal.previous, this._list)
}, get, next(), ILinkedListNode( | null, {
    this: .throwIfDetached(),
    return: ensureExternal(this._nodeInternal.next, this._list)
}, get, value(), T, {
    this: .throwIfDetached(),
    return() { }, this: ._nodeInternal.value
}, set, value(v, T), {
    this: .throwIfDetached(),
    this: ._nodeInternal.value = v
}, addBefore(entry, T), void {
    this: .throwIfDetached(),
    this: ._list.addBefore(this, entry)
}, addAfter(entry, T), void {
    this: .throwIfDetached(),
    this: ._list.addAfter(this, entry)
}, remove(), void {
    var: list = this._list,
    if(list) { }, list: .removeNode(this),
    this: ._list = VOID0,
    this: ._nodeInternal = VOID0
}, dispose(), void {
    this: .remove()
})))))))));
export default LinkedList;
//# sourceMappingURL=LinkedList.js.map