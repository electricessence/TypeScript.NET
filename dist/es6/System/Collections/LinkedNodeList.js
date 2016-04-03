/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import * as TextUtility from '../Text/Utility';
import InvalidOperationException from '../Exceptions/InvalidOperationException';
import ArgumentException from '../Exceptions/ArgumentException';
import ArgumentNullException from '../Exceptions/ArgumentNullException';
export default class LinkedNodeList {
    constructor() {
        this._first = null;
        this._last = null;
    }
    get first() {
        return this._first;
    }
    get last() {
        return this._last;
    }
    get count() {
        var next = this._first, i = 0;
        while (next) {
            i++;
            next = next.next;
        }
        return i;
    }
    clear() {
        var _ = this, n, cF = 0, cL = 0;
        n = _._first;
        _._first = null;
        while (n) {
            cF++;
            n.previous = null;
            n = n.next;
        }
        n = _._last;
        _._last = null;
        while (n) {
            cL++;
            n.next = null;
            n = n.previous;
        }
        if (cF !== cL)
            console.warn('LinkedNodeList: Forward versus reverse count does not match when clearing.');
        return cF;
    }
    dispose() {
        this.clear();
    }
    contains(node) {
        return this.indexOf(node) != -1;
    }
    getNodeAt(index) {
        if (index < 0)
            return null;
        var next = this._first, i = 0;
        while (next && index < i++) {
            next = next.next;
        }
        return next;
    }
    indexOf(node) {
        if (node != null && (node.previous || node.next)) {
            var index = 0;
            var c = this._first;
            while (c) {
                if (c === node)
                    return index;
                index++;
                c = c.next;
            }
        }
        return -1;
    }
    removeFirst() {
        return this.removeNode(this._first);
    }
    removeLast() {
        return this.removeNode(this._last);
    }
    removeNode(node) {
        if (node == null)
            throw new ArgumentNullException('node');
        var _ = this;
        var prev = node.previous, next = node.next, a = false, b = false;
        if (prev)
            prev.next = next;
        else if (_._first == node)
            _._first = next;
        else
            a = true;
        if (next)
            next.previous = prev;
        else if (_._last == node)
            _._last = prev;
        else
            b = true;
        if (a !== b) {
            throw new ArgumentException('node', TextUtility.format("Provided node is has no {0} reference but is not the {1} node!", a ? "previous" : "next", a ? "first" : "last"));
        }
        return !a && !b;
    }
    addNode(node) {
        this.addNodeAfter(node);
    }
    addNodeBefore(node, before) {
        assertValidDetached(node);
        var _ = this;
        if (!before) {
            before = _._first;
        }
        if (before) {
            node.previous = before.previous;
            node.next = before;
            before.previous = node;
            if (before == _._first)
                _._last = node;
        }
        else {
            _._first = _._last = node;
        }
    }
    addNodeAfter(node, after) {
        assertValidDetached(node);
        var _ = this;
        if (!after) {
            after = _._last;
        }
        if (after) {
            node.next = after.next;
            node.previous = after;
            after.next = node;
            if (after == _._last)
                _._last = node;
        }
        else {
            _._first = _._last = node;
        }
    }
    replace(node, replacement) {
        if (node == null)
            throw new ArgumentNullException('node');
        assertValidDetached(replacement, 'replacement');
        var _ = this;
        replacement.previous = node.previous;
        replacement.next = node.next;
        if (node.previous)
            node.previous.next = replacement;
        if (node.next)
            node.next.previous = replacement;
        if (node == _._first)
            _._first = replacement;
        if (node == _._last)
            _._last = replacement;
    }
}
function assertValidDetached(node, propName = 'node') {
    if (node == null)
        throw new ArgumentNullException(propName);
    if (node.next || node.previous)
        throw new InvalidOperationException("Cannot add a node to a LinkedNodeList that is already linked.");
}
//# sourceMappingURL=LinkedNodeList.js.map