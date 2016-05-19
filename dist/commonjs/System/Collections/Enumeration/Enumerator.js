/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dispose_1 = require("../../Disposable/dispose");
var Types_1 = require("../../Types");
var ArrayEnumerator_1 = require("./ArrayEnumerator");
var IndexEnumerator_1 = require("./IndexEnumerator");
var UnsupportedEnumerableException_1 = require("./UnsupportedEnumerableException");
var VOID0 = void 0,
    STRING_EMPTY = "",
    ENDLESS_EXCEPTION_MESSAGE = 'Cannot call forEach on an endless enumerable. ' + 'Would result in an infinite loop that could hang the current process.';
function throwIfEndless(isEndless) {
    if (isEndless) throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException(ENDLESS_EXCEPTION_MESSAGE);
}
exports.throwIfEndless = throwIfEndless;
function initArrayFrom(source) {
    if (Array.isArray(source) || Types_1.Type.isString(source)) {
        var len = source.length;
        if (isFinite(len)) {
            if (len > 65535) return new Array(len);
            var result = [];
            result.length = len;
            return result;
        }
    }
    return [];
}

var EmptyEnumerator = function () {
    function EmptyEnumerator() {
        _classCallCheck(this, EmptyEnumerator);
    }

    _createClass(EmptyEnumerator, [{
        key: "moveNext",
        value: function moveNext() {
            return false;
        }
    }, {
        key: "nextValue",
        value: function nextValue() {
            return VOID0;
        }
    }, {
        key: "next",
        value: function next() {
            return {
                value: VOID0,
                done: true
            };
        }
    }, {
        key: "reset",
        value: function reset() {}
    }, {
        key: "dispose",
        value: function dispose() {}
    }, {
        key: "current",
        get: function get() {
            return VOID0;
        }
    }, {
        key: "isEndless",
        get: function get() {
            return false;
        }
    }]);

    return EmptyEnumerator;
}();

var Empty = new EmptyEnumerator();
Object.freeze(Empty);
exports.empty = Empty;
function from(source) {
    if (!source) return Empty;
    if (Array.isArray(source)) return new ArrayEnumerator_1.ArrayEnumerator(source);
    if (Types_1.Type.isArrayLike(source)) {
        return new IndexEnumerator_1.IndexEnumerator(function () {
            return {
                source: source,
                length: source.length,
                pointer: 0,
                step: 1
            };
        });
    }
    if (!Types_1.Type.isPrimitive(source)) {
        if (isEnumerable(source)) return source.getEnumerator();
    }
    throw new Error("Unknown enumerable.");
}
exports.from = from;
function isEnumerable(instance) {
    return Types_1.Type.hasMemberOfType(instance, "getEnumerator", Types_1.Type.FUNCTION);
}
exports.isEnumerable = isEnumerable;
function isEnumerableOrArrayLike(instance) {
    return Types_1.Type.isArrayLike(instance) || isEnumerable(instance);
}
exports.isEnumerableOrArrayLike = isEnumerableOrArrayLike;
function isEnumerator(instance) {
    return Types_1.Type.hasMemberOfType(instance, "moveNext", Types_1.Type.FUNCTION);
}
exports.isEnumerator = isEnumerator;
function forEach(e, action) {
    if (e !== VOID0 && e !== null) {
        if (Types_1.Type.isArrayLike(e)) {
            throwIfEndless(!isFinite(e.length));
            for (var i = 0; i < e.length; i++) {
                if (action(e[i], i) === false) break;
            }
            return true;
        }
        if (isEnumerator(e)) {
            throwIfEndless(e.isEndless);
            var index = 0;
            while (e.moveNext()) {
                if (action(e.current, index++) === false) break;
            }
            return true;
        }
        if (isEnumerable(e)) {
            throwIfEndless(e.isEndless);
            dispose_1.using(e.getEnumerator(), function (f) {
                return forEach(f, action);
            });
            return true;
        }
        return false;
    }
}
exports.forEach = forEach;
function toArray(source) {
    if (source === STRING_EMPTY) return [];
    if (Array.isArray(source)) return source.slice();
    var result = initArrayFrom(source);
    if (!forEach(source, function (e, i) {
        result[i] = e;
    })) throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException();
    return result;
}
exports.toArray = toArray;
function map(source, selector) {
    var result = initArrayFrom(source);
    if (!forEach(source, function (e, i) {
        result[i] = selector(e);
    })) throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException();
    return result;
}
exports.map = map;
//# sourceMappingURL=Enumerator.js.map
