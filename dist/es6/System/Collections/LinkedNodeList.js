/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as TextUtility from "../Text/Utility";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { EnumeratorBase } from "./Enumeration/EnumeratorBase";
export class LinkedNodeList {
    constructor() {
        this._first = null;
        this._last = null;
        this.unsafeCount = 0;
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
    forEach(action) {
        var current = null, next = this.first, index = 0;
        do {
            current = next;
            next = current && current.next;
        } while (current
            && action(current, index++) !== false);
        return index;
    }
    map(selector) {
        if (!selector)
            throw new ArgumentNullException('selector');
        var result = [];
        this.forEach(node => {
            result.push(selector(node));
        });
        return result;
    }
    clear() {
        var _ = this, n, cF = 0, cL = 0;
        n = _._first;
        _._first = null;
        while (n) {
            cF++;
            let current = n;
            n = n.next;
            current.next = null;
        }
        n = _._last;
        _._last = null;
        while (n) {
            cL++;
            let current = n;
            n = n.previous;
            current.previous = null;
        }
        if (cF !== cL)
            console.warn('LinkedNodeList: Forward versus reverse count does not match when clearing. Forward: ' + cF + ", Reverse: " + cL);
        _.unsafeCount = 0;
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
    find(condition) {
        var node = null;
        this.forEach((n, i) => {
            if (condition(n, i)) {
                node = n;
                return false;
            }
        });
        return node;
    }
    indexOf(node) {
        if (node && (node.previous || node.next)) {
            var index = 0;
            var c, n = this._first;
            do {
                c = n;
                if (c === node)
                    return index;
                index++;
            } while ((n = c && c.next));
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
        var removed = !a && !b;
        if (removed) {
            _.unsafeCount--;
            node.previous = null;
            node.next = null;
        }
        return removed;
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
            let prev = before.previous;
            node.previous = prev;
            node.next = before;
            before.previous = node;
            if (prev)
                prev.next = node;
            if (before == _._first)
                _._last = node;
        }
        else {
            _._first = _._last = node;
        }
        _.unsafeCount++;
    }
    addNodeAfter(node, after) {
        assertValidDetached(node);
        var _ = this;
        if (!after) {
            after = _._last;
        }
        if (after) {
            let next = after.next;
            node.next = next;
            node.previous = after;
            after.next = node;
            if (next)
                next.previous = node;
            if (after == _._last)
                _._last = node;
        }
        else {
            _._first = _._last = node;
        }
        _.unsafeCount++;
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
    static valueEnumeratorFrom(list) {
        if (!list)
            throw new ArgumentNullException('list');
        var _ = this, current, next;
        return new EnumeratorBase(() => {
            current = null;
            next = list.first;
        }, (yielder) => {
            if (next) {
                current = next;
                next = current && current.next;
                return yielder.yieldReturn(current.value);
            }
            return yielder.yieldBreak();
        });
    }
    static copyValues(list, array, index = 0) {
        if (list && list.first) {
            if (!array)
                throw new ArgumentNullException('array');
            list.forEach((node, i) => {
                array[index + i] = node.value;
            });
        }
        return array;
    }
}
function assertValidDetached(node, propName = 'node') {
    if (node == null)
        throw new ArgumentNullException(propName);
    if (node.next || node.previous)
        throw new InvalidOperationException("Cannot add a node to a LinkedNodeList that is already linked.");
}
export default LinkedNodeList;
//# sourceMappingURL=LinkedNodeList.js.map