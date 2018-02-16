"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Utility_1 = require("../Text/Utility");
var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
var ArgumentException_1 = require("../Exceptions/ArgumentException");
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var EnumeratorBase_1 = require("./Enumeration/EnumeratorBase");
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
/*****************************
 * IMPORTANT NOTES ABOUT PERFORMANCE:
 * http://jsperf.com/simulating-a-queue
 *
 * Adding to an array is very fast, but modifying is slow.
 * LinkedList wins when modifying contents.
 * http://stackoverflow.com/questions/166884/array-versus-linked-list
 *****************************/
/**
 * This class is useful for managing a list of linked nodes, but it does not protect against modifying individual links.
 * If the consumer modifies a link (sets the previous or next value) it will effectively break the collection.
 *
 * It is possible to declare a node type of any kind as long as it contains a previous and next value that can reference another node.
 * Although not as safe as the included LinkedList, this class has less overhead and is more flexible.
 *
 * The count (or length) of this LinkedNodeList is not tracked since it could be corrupted at any time.
 */
var LinkedNodeList = /** @class */ (function () {
    function LinkedNodeList() {
        this._first = null;
        this._last = null;
        this.unsafeCount = 0;
        this._version = 0;
    }
    LinkedNodeList.prototype.assertVersion = function (version) {
        if (version !== this._version)
            throw new InvalidOperationException_1.InvalidOperationException("Collection was modified.");
        return true;
    };
    Object.defineProperty(LinkedNodeList.prototype, "first", {
        /**
         * The first node.  Will be null if the collection is empty.
         */
        get: function () {
            return this._first;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkedNodeList.prototype, "last", {
        /**
         * The last node.
         */
        get: function () {
            return this._last;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkedNodeList.prototype, "count", {
        /**
         * Iteratively counts the number of linked nodes and returns the value.
         * @returns {number}
         */
        get: function () {
            var next = this._first;
            var i = 0;
            while (next) {
                i++;
                next = next.next;
            }
            return i;
        },
        enumerable: true,
        configurable: true
    });
    LinkedNodeList.prototype.forEach = function (action, ignoreVersioning) {
        var _ = this;
        var current = null, next = _.first; // Be sure to track the next node so if current node is removed.
        var version = _._version;
        var index = 0;
        do {
            if (!ignoreVersioning)
                _.assertVersion(version);
            current = next;
            next = current && current.next;
        } while (current
            && action(current, index++) !== false);
        return index;
    };
    LinkedNodeList.prototype.map = function (selector) {
        if (!selector)
            throw new ArgumentNullException_1.ArgumentNullException('selector');
        var result = [];
        this.forEach(function (node, i) {
            result.push(selector(node, i));
        });
        return result;
    };
    /**
     * Erases the linked node's references to each other and returns the number of nodes.
     * @returns {number}
     */
    LinkedNodeList.prototype.clear = function () {
        var _ = this;
        var n, cF = 0, cL = 0;
        // First, clear in the forward direction.
        n = _._first;
        _._first = null;
        while (n) {
            cF++;
            var current = n;
            n = n.next;
            current.next = null;
        }
        // Last, clear in the reverse direction.
        n = _._last;
        _._last = null;
        while (n) {
            cL++;
            var current = n;
            n = n.previous;
            current.previous = null;
        }
        if (cF !== cL)
            console.warn('LinkedNodeList: Forward versus reverse count does not match when clearing. Forward: ' + cF + ", Reverse: " + cL);
        _._version++;
        _.unsafeCount = 0;
        return cF;
    };
    /**
     * Clears the list.
     */
    LinkedNodeList.prototype.dispose = function () {
        this.clear();
    };
    /**
     * Iterates the list to see if a node exists.
     * @param node
     * @returns {boolean}
     */
    LinkedNodeList.prototype.contains = function (node) {
        return this.indexOf(node) != -1;
    };
    /**
     * Gets the index of a particular node.
     * @param index
     */
    LinkedNodeList.prototype.getNodeAt = function (index) {
        if (index < 0)
            return null;
        var next = this._first;
        var i = 0;
        while (next && i++ < index) {
            next = next.next || null;
        }
        return next;
    };
    LinkedNodeList.prototype.find = function (condition) {
        var node = null;
        this.forEach(function (n, i) {
            if (condition(n, i)) {
                node = n;
                return false;
            }
        });
        return node;
    };
    /**
     * Iterates the list to find the specified node and returns its index.
     * @param node
     * @returns {boolean}
     */
    LinkedNodeList.prototype.indexOf = function (node) {
        if (node && (node.previous || node.next)) {
            var index = 0;
            var c = void 0, n = this._first;
            do {
                c = n;
                if (c === node)
                    return index;
                index++;
            } while ((n = c && c.next));
        }
        return -1;
    };
    /**
     * Removes the first node and returns true if successful.
     * @returns {boolean}
     */
    LinkedNodeList.prototype.removeFirst = function () {
        return !!this._first && this.removeNode(this._first);
    };
    /**
     * Removes the last node and returns true if successful.
     * @returns {boolean}
     */
    LinkedNodeList.prototype.removeLast = function () {
        return !!this._last && this.removeNode(this._last);
    };
    /**
     * Removes the specified node.
     * Returns true if successful and false if not found (already removed).
     * @param node
     * @returns {boolean}
     */
    LinkedNodeList.prototype.removeNode = function (node) {
        if (node == null)
            throw new ArgumentNullException_1.ArgumentNullException('node');
        var _ = this;
        var prev = node.previous || null, next = node.next || null;
        var a = false, b = false;
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
            throw new ArgumentException_1.ArgumentException('node', Utility_1.format("Provided node is has no {0} reference but is not the {1} node!", a ? "previous" : "next", a ? "first" : "last"));
        }
        var removed = !a && !b;
        if (removed) {
            _._version++;
            _.unsafeCount--;
            node.previous = null;
            node.next = null;
        }
        return removed;
    };
    /**
     * Adds a node to the end of the list.
     * @param node
     * @returns {LinkedNodeList}
     */
    LinkedNodeList.prototype.addNode = function (node) {
        this.addNodeAfter(node);
        return this;
    };
    /**
     * Inserts a node before the specified 'before' node.
     * If no 'before' node is specified, it inserts it as the first node.
     * @param node
     * @param before
     * @returns {LinkedNodeList}
     */
    LinkedNodeList.prototype.addNodeBefore = function (node, before) {
        if (before === void 0) { before = null; }
        assertValidDetached(node);
        var _ = this;
        if (!before) {
            before = _._first;
        }
        if (before) {
            var prev = before.previous;
            node.previous = prev;
            node.next = before;
            before.previous = node;
            if (prev)
                prev.next = node;
            if (before == _._first)
                _._first = node;
        }
        else {
            _._first = _._last = node;
        }
        _._version++;
        _.unsafeCount++;
        return this;
    };
    /**
     * Inserts a node after the specified 'after' node.
     * If no 'after' node is specified, it appends it as the last node.
     * @param node
     * @param after
     * @returns {LinkedNodeList}
     */
    LinkedNodeList.prototype.addNodeAfter = function (node, after) {
        if (after === void 0) { after = null; }
        assertValidDetached(node);
        var _ = this;
        if (!after) {
            after = _._last;
        }
        if (after) {
            var next = after.next;
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
        _._version++;
        _.unsafeCount++;
        return _;
    };
    /**
     * Takes and existing node and replaces it.
     * @param node
     * @param replacement
     * @returns {any}
     */
    LinkedNodeList.prototype.replace = function (node, replacement) {
        if (node == null)
            throw new ArgumentNullException_1.ArgumentNullException('node');
        if (node == replacement)
            return this;
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
        _._version++;
        return _;
    };
    LinkedNodeList.valueEnumeratorFrom = function (list) {
        if (!list)
            throw new ArgumentNullException_1.ArgumentNullException('list');
        var current, next, version;
        return new EnumeratorBase_1.EnumeratorBase(function () {
            // Initialize anchor...
            current = null;
            next = list.first;
            version = list._version;
        }, function (yielder) {
            if (next) {
                list.assertVersion(version);
                current = next;
                next = current && current.next;
                return yielder.yieldReturn(current.value);
            }
            return yielder.yieldBreak();
        });
    };
    LinkedNodeList.copyValues = function (list, array, index) {
        if (index === void 0) { index = 0; }
        if (list && list.first) {
            if (!array)
                throw new ArgumentNullException_1.ArgumentNullException('array');
            list.forEach(function (node, i) {
                array[index + i] = node.value;
            });
        }
        return array;
    };
    return LinkedNodeList;
}());
exports.LinkedNodeList = LinkedNodeList;
function assertValidDetached(node, propName) {
    if (propName === void 0) { propName = 'node'; }
    if (node == null)
        throw new ArgumentNullException_1.ArgumentNullException(propName);
    if (node.next || node.previous)
        throw new InvalidOperationException_1.InvalidOperationException("Cannot add a node to a LinkedNodeList that is already linked.");
}
exports.default = LinkedNodeList;
//# sourceMappingURL=LinkedNodeList.js.map