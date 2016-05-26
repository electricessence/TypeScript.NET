/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextUtility = require("../Text/Utility");
var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
var ArgumentException_1 = require("../Exceptions/ArgumentException");
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var EnumeratorBase_1 = require("./Enumeration/EnumeratorBase");

var LinkedNodeList = function () {
    function LinkedNodeList() {
        _classCallCheck(this, LinkedNodeList);

        this._first = null;
        this._last = null;
        this.unsafeCount = 0;
    }

    _createClass(LinkedNodeList, [{
        key: "forEach",
        value: function forEach(action) {
            var current = null,
                next = this.first,
                index = 0;
            do {
                current = next;
                next = current && current.next;
            } while (current && action(current, index++) !== false);
            return index;
        }
    }, {
        key: "map",
        value: function map(selector) {
            if (!selector) throw new ArgumentNullException_1.ArgumentNullException('selector');
            var result = [];
            this.forEach(function (node) {
                result.push(selector(node));
            });
            return result;
        }
    }, {
        key: "clear",
        value: function clear() {
            var _ = this,
                n,
                cF = 0,
                cL = 0;
            n = _._first;
            _._first = null;
            while (n) {
                cF++;
                var current = n;
                n = n.next;
                current.next = null;
            }
            n = _._last;
            _._last = null;
            while (n) {
                cL++;
                var _current = n;
                n = n.previous;
                _current.previous = null;
            }
            if (cF !== cL) console.warn('LinkedNodeList: Forward versus reverse count does not match when clearing. Forward: ' + cF + ", Reverse: " + cL);
            _.unsafeCount = 0;
            return cF;
        }
    }, {
        key: "dispose",
        value: function dispose() {
            this.clear();
        }
    }, {
        key: "contains",
        value: function contains(node) {
            return this.indexOf(node) != -1;
        }
    }, {
        key: "getNodeAt",
        value: function getNodeAt(index) {
            if (index < 0) return null;
            var next = this._first,
                i = 0;
            while (next && index < i++) {
                next = next.next;
            }
            return next;
        }
    }, {
        key: "find",
        value: function find(condition) {
            var node = null;
            this.forEach(function (n, i) {
                if (condition(n, i)) {
                    node = n;
                    return false;
                }
            });
            return node;
        }
    }, {
        key: "indexOf",
        value: function indexOf(node) {
            if (node && (node.previous || node.next)) {
                var index = 0;
                var c,
                    n = this._first;
                do {
                    c = n;
                    if (c === node) return index;
                    index++;
                } while (n = c && c.next);
            }
            return -1;
        }
    }, {
        key: "removeFirst",
        value: function removeFirst() {
            return this.removeNode(this._first);
        }
    }, {
        key: "removeLast",
        value: function removeLast() {
            return this.removeNode(this._last);
        }
    }, {
        key: "removeNode",
        value: function removeNode(node) {
            if (node == null) throw new ArgumentNullException_1.ArgumentNullException('node');
            var _ = this;
            var prev = node.previous,
                next = node.next,
                a = false,
                b = false;
            if (prev) prev.next = next;else if (_._first == node) _._first = next;else a = true;
            if (next) next.previous = prev;else if (_._last == node) _._last = prev;else b = true;
            if (a !== b) {
                throw new ArgumentException_1.ArgumentException('node', TextUtility.format("Provided node is has no {0} reference but is not the {1} node!", a ? "previous" : "next", a ? "first" : "last"));
            }
            var removed = !a && !b;
            if (removed) {
                _.unsafeCount--;
                node.previous = null;
                node.next = null;
            }
            return removed;
        }
    }, {
        key: "addNode",
        value: function addNode(node) {
            this.addNodeAfter(node);
        }
    }, {
        key: "addNodeBefore",
        value: function addNodeBefore(node, before) {
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
                if (prev) prev.next = node;
                if (before == _._first) _._last = node;
            } else {
                _._first = _._last = node;
            }
            _.unsafeCount++;
        }
    }, {
        key: "addNodeAfter",
        value: function addNodeAfter(node, after) {
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
                if (next) next.previous = node;
                if (after == _._last) _._last = node;
            } else {
                _._first = _._last = node;
            }
            _.unsafeCount++;
        }
    }, {
        key: "replace",
        value: function replace(node, replacement) {
            if (node == null) throw new ArgumentNullException_1.ArgumentNullException('node');
            assertValidDetached(replacement, 'replacement');
            var _ = this;
            replacement.previous = node.previous;
            replacement.next = node.next;
            if (node.previous) node.previous.next = replacement;
            if (node.next) node.next.previous = replacement;
            if (node == _._first) _._first = replacement;
            if (node == _._last) _._last = replacement;
        }
    }, {
        key: "first",
        get: function get() {
            return this._first;
        }
    }, {
        key: "last",
        get: function get() {
            return this._last;
        }
    }, {
        key: "count",
        get: function get() {
            var next = this._first,
                i = 0;
            while (next) {
                i++;
                next = next.next;
            }
            return i;
        }
    }], [{
        key: "valueEnumeratorFrom",
        value: function valueEnumeratorFrom(list) {
            if (!list) throw new ArgumentNullException_1.ArgumentNullException('list');
            var _ = this,
                current,
                next;
            return new EnumeratorBase_1.EnumeratorBase(function () {
                current = null;
                next = list.first;
            }, function (yielder) {
                if (next) {
                    current = next;
                    next = current && current.next;
                    return yielder.yieldReturn(current.value);
                }
                return yielder.yieldBreak();
            });
        }
    }, {
        key: "copyValues",
        value: function copyValues(list, array) {
            var index = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

            if (list && list.first) {
                if (!array) throw new ArgumentNullException_1.ArgumentNullException('array');
                list.forEach(function (node, i) {
                    array[index + i] = node.value;
                });
            }
            return array;
        }
    }]);

    return LinkedNodeList;
}();

exports.LinkedNodeList = LinkedNodeList;
function assertValidDetached(node) {
    var propName = arguments.length <= 1 || arguments[1] === undefined ? 'node' : arguments[1];

    if (node == null) throw new ArgumentNullException_1.ArgumentNullException(propName);
    if (node.next || node.previous) throw new InvalidOperationException_1.InvalidOperationException("Cannot add a node to a LinkedNodeList that is already linked.");
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinkedNodeList;
//# sourceMappingURL=LinkedNodeList.js.map
