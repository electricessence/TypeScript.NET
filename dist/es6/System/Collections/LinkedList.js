/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import * as Values from '../Compare';
import * as TextUtility from '../Text/Utility';
import * as ArrayUtility from '../Collections/Array/Utility';
import * as Enumerator from './Enumeration/Enumerator';
import EnumeratorBase from './Enumeration/EnumeratorBase';
import InvalidOperationException from '../Exceptions/InvalidOperationException';
import ArgumentException from '../Exceptions/ArgumentException';
import ArgumentNullException from '../Exceptions/ArgumentNullException';
import ArgumentOutOfRangeException from '../Exceptions/ArgumentOutOfRangeException';
class Node {
    constructor(value, prev, next) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
    assertDetached() {
        if (this.next || this.prev)
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
    _addFirst(entry) {
        var _ = this, first = _._first;
        var prev = new Node(entry, null, first);
        if (first)
            first.prev = prev;
        else
            _._last = prev;
        _._first = prev;
        _._count += 1;
        return prev;
    }
    _addLast(entry) {
        var _ = this, last = _._last;
        var next = new Node(entry, last);
        if (last)
            last.next = next;
        else
            _._first = next;
        _._last = next;
        _._count += 1;
        return next;
    }
    _addNodeBefore(n, inserting) {
        inserting.assertDetached();
        inserting.next = n;
        inserting.prev = n.prev;
        n.prev.next = inserting;
        n.prev = inserting;
        this._count += 1;
    }
    _addNodeAfter(n, inserting) {
        inserting.assertDetached();
        inserting.prev = n;
        inserting.next = n.next;
        n.next.prev = inserting;
        n.next = inserting;
        this._count += 1;
    }
    _findFirst(entry) {
        var equals = Values.areEqual, next = this._first;
        while (next) {
            if (equals(entry, next.value))
                return next;
            next = next.next;
        }
        return null;
    }
    _findLast(entry) {
        var equals = Values.areEqual, prev = this._last;
        while (prev) {
            if (equals(entry, prev.value))
                return prev;
            prev = prev.prev;
        }
        return null;
    }
    forEach(action, useCopy = false) {
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
    }
    getEnumerator() {
        var _ = this, current;
        return new EnumeratorBase(() => {
            current = new Node(null, null, _._first);
        }, (yielder) => (current = current.next)
            ? yielder.yieldReturn(current.value)
            : yielder.yieldBreak());
    }
    get count() {
        return this._count;
    }
    get isReadOnly() {
        return false;
    }
    add(entry) {
        this._addLast(entry);
    }
    clear() {
        var _ = this;
        _._first = null;
        _._last = null;
        var count = _._count;
        _._count = 0;
        return count;
    }
    contains(entry) {
        var found = false, equals = Values.areEqual;
        this.forEach(e => !(found = equals(entry, e)));
        return found;
    }
    copyTo(array, index = 0) {
        this.forEach((entry, i) => {
            array[index + i] = entry;
        });
        return array;
    }
    toArray() {
        var array = ArrayUtility.initialize(this._count);
        return this.copyTo(array);
    }
    removeOnce(entry) {
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
    }
    remove(entry) {
        var _ = this, removedCount = 0;
        while (_.removeOnce(entry)) {
            ++removedCount;
        }
        return removedCount;
    }
    get first() {
        return ensureExternal(this._first, this);
    }
    get last() {
        return ensureExternal(this._last, this);
    }
    _getNodeAt(index) {
        if (index < 0)
            throw new ArgumentOutOfRangeException('index', index, 'Is less than zero.');
        if (index >= this._count)
            throw new ArgumentOutOfRangeException('index', index, 'Is greater than count.');
        var next = this._first, i = 0;
        while (next && index < i++) {
            next = next.next;
        }
        return next;
    }
    getValueAt(index) {
        return this._getNodeAt(index).value;
    }
    getNodeAt(index) {
        return ensureExternal(this._getNodeAt(index), this);
    }
    find(entry) {
        return ensureExternal(this._findFirst(entry), this);
    }
    findLast(entry) {
        return ensureExternal(this._findLast(entry), this);
    }
    addFirst(entry) {
        this._addFirst(entry);
    }
    addLast(entry) {
        this._addLast(entry);
    }
    removeFirst() {
        var _ = this, first = _._first;
        if (first) {
            var next = first.next;
            _._first = next;
            if (next)
                next.prev = null;
            _._count -= 1;
        }
    }
    removeLast() {
        var _ = this, last = _._last;
        if (last) {
            var prev = last.prev;
            _._last = prev;
            if (prev)
                prev.next = null;
            _._count -= 1;
        }
    }
    removeNode(node) {
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
            throw new ArgumentException('node', TextUtility.format("Provided node is has no {0} reference but is not the {1} node!", a ? "previous" : "next", a ? "first" : "last"));
        }
        return !a && !b;
    }
    addBefore(node, entry) {
        this._addNodeBefore(getInternal(node, this), new Node(entry));
    }
    addAfter(node, entry) {
        this._addNodeAfter(getInternal(node, this), new Node(entry));
    }
    addNodeBefore(node, before) {
        this._addNodeBefore(getInternal(node, this), getInternal(before, this));
    }
    addNodeAfter(node, after) {
        this._addNodeAfter(getInternal(node, this), getInternal(after, this));
    }
}
class LinkedListNode {
    constructor(_list, _node) {
        this._list = _list;
        this._node = _node;
    }
    get list() {
        return this._list;
    }
    get previous() {
        return ensureExternal(this._node.prev, this._list);
    }
    get next() {
        return ensureExternal(this._node.next, this._list);
    }
    get value() {
        return this._node.value;
    }
    set value(v) {
        this._node.value = v;
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