/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var dispose_1 = require("../../Disposable/dispose");
var Types_1 = require("../../Types");
var ArrayEnumerator_1 = require("./ArrayEnumerator");
var IndexEnumerator_1 = require("./IndexEnumerator");
var UnsupportedEnumerableException_1 = require("./UnsupportedEnumerableException");
var InfiniteEnumerator_1 = require("./InfiniteEnumerator");
var EmptyEnumerator_1 = require("./EmptyEnumerator");
var IteratorEnumerator_1 = require("./IteratorEnumerator");
var VOID0 = void 0,
    STRING_EMPTY = "",
    ENDLESS_EXCEPTION_MESSAGE = 'Cannot call forEach on an endless enumerable. ' + 'Would result in an infinite loop that could hang the current process.';
function throwIfEndless(isEndless) {
    if (isEndless) throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException(ENDLESS_EXCEPTION_MESSAGE);
}
exports.throwIfEndless = throwIfEndless;
function initArrayFrom(source) {
    var max = arguments.length <= 1 || arguments[1] === undefined ? Infinity : arguments[1];

    if (Array.isArray(source) || Types_1.Type.isString(source)) {
        var len = Math.min(source.length, max);
        if (isFinite(len)) {
            if (len > 65535) return new Array(len);
            var result = [];
            result.length = len;
            return result;
        }
    }
    return [];
}
function from(source) {
    if (!source) return EmptyEnumerator_1.EmptyEnumerator;
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
        if (Types_1.Type.isFunction(source)) return new InfiniteEnumerator_1.InfiniteEnumerator(source);
        if (isIterator(source)) return new IteratorEnumerator_1.IteratorEnumerator(source);
    }
    throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException();
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
function isIterator(instance) {
    return Types_1.Type.hasMemberOfType(instance, "next", Types_1.Type.FUNCTION);
}
exports.isIterator = isIterator;
function forEach(e, action) {
    var max = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

    if (e === STRING_EMPTY) return 0;
    if (e && max > 0) {
        if (Types_1.Type.isArrayLike(e)) {
            throwIfEndless(!isFinite(max) && !isFinite(e.length));
            var i = 0;
            for (; i < Math.min(e.length, max); i++) {
                if (action(e[i], i) === false) break;
            }
            return i;
        }
        if (isEnumerator(e)) {
            throwIfEndless(!isFinite(max) && e.isEndless);
            var _i = 0;
            while (max > _i && e.moveNext()) {
                if (action(e.current, _i++) === false) break;
            }
            return _i;
        }
        if (isEnumerable(e)) {
            throwIfEndless(!isFinite(max) && e.isEndless);
            return dispose_1.using(e.getEnumerator(), function (f) {
                return forEach(f, action, max);
            });
        }
        if (isIterator(e)) {
            throwIfEndless(!isFinite(max));
            var _i2 = 0,
                r = undefined;
            while (max > _i2 && !(r = e.next()).done) {
                if (action(r.value, _i2++) === false) break;
            }
            return _i2;
        }
    }
    return -1;
}
exports.forEach = forEach;
function toArray(source) {
    var max = arguments.length <= 1 || arguments[1] === undefined ? Infinity : arguments[1];

    if (source === STRING_EMPTY) return [];
    if (!isFinite(max) && Array.isArray(source)) return source.slice();
    var result = initArrayFrom(source, max);
    if (-1 === forEach(source, function (e, i) {
        result[i] = e;
    }, max)) throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException();
    return result;
}
exports.toArray = toArray;
function map(source, selector) {
    var max = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

    if (source === STRING_EMPTY) return [];
    if (!isFinite(max) && Array.isArray(source)) return source.map(selector);
    var result = initArrayFrom(source, max);
    if (-1 === forEach(source, function (e, i) {
        result[i] = selector(e);
    }, max)) throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException();
    return result;
}
exports.map = map;
//# sourceMappingURL=Enumerator.js.map
