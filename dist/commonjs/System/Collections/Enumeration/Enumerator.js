"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var dispose_1 = require("../../Disposable/dispose");
var Types_1 = require("../../Types");
var ArrayEnumerator_1 = require("./ArrayEnumerator");
var IndexEnumerator_1 = require("./IndexEnumerator");
var UnsupportedEnumerableException_1 = require("./UnsupportedEnumerableException");
var InfiniteEnumerator_1 = require("./InfiniteEnumerator");
var EmptyEnumerator_1 = require("./EmptyEnumerator");
var IteratorEnumerator_1 = require("./IteratorEnumerator");
var STRING_EMPTY = "", ENDLESS_EXCEPTION_MESSAGE = 'Cannot call forEach on an endless enumerable. ' +
    'Would result in an infinite loop that could hang the current process.';
function throwIfEndless(isEndless) {
    if (isEndless)
        throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException(ENDLESS_EXCEPTION_MESSAGE);
    return true;
}
exports.throwIfEndless = throwIfEndless;
function initArrayFrom(source, max) {
    if (max === void 0) { max = Infinity; }
    if (Types_1.Type.isArrayLike(source)) {
        var len = Math.min(source.length, max);
        if (isFinite(len)) {
            if (len > 65535)
                return new Array(len);
            var result = [];
            result.length = len;
            return result;
        }
    }
    return [];
}
// Could be array, or IEnumerable...
/**
 * Returns the enumerator for the specified collection, enumerator, or iterator.
 * If the source is identified as IEnumerator it will return the source as is.
 * @param source
 * @returns {any}
 */
function from(source) {
    // To simplify and prevent null reference exceptions:
    if (!source)
        return EmptyEnumerator_1.EmptyEnumerator;
    if ((source) instanceof (Array))
        return new ArrayEnumerator_1.ArrayEnumerator(source);
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
        if (isEnumerable(source))
            return source.getEnumerator();
        if (Types_1.Type.isFunction(source))
            return new InfiniteEnumerator_1.InfiniteEnumerator(source);
        if (isEnumerator(source))
            return source;
        if (isIterator(source))
            return new IteratorEnumerator_1.IteratorEnumerator(source);
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
function forEach(e, action, max) {
    if (max === void 0) { max = Infinity; }
    if (e === STRING_EMPTY)
        return 0;
    if (e && max > 0) {
        if (Types_1.Type.isArrayLike(e)) {
            // Assume e.length is constant or at least doesn't deviate to infinite or NaN.
            throwIfEndless(!isFinite(max) && !isFinite(e.length));
            var i = 0;
            while (i < Math.min(e.length, max)) {
                if (action(e[i], i++) === false)
                    break;
            }
            return i;
        }
        if (isEnumerator(e)) {
            throwIfEndless(!isFinite(max) && e.isEndless);
            var i = 0;
            // Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
            while (max > i && e.moveNext()) {
                if (action(e.current, i++) === false)
                    break;
            }
            return i;
        }
        if (isEnumerable(e)) {
            throwIfEndless(!isFinite(max) && e.isEndless);
            // For enumerators that aren't EnumerableBase, ensure dispose is called.
            return dispose_1.using(e.getEnumerator(), function (f) { return forEach(f, action, max); });
        }
        if (isIterator(e)) {
            // For our purpose iterators are endless and a max must be specified before iterating.
            throwIfEndless(!isFinite(max));
            var i = 0, r = void 0;
            // Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
            while (max > i && !(r = e.next()).done) {
                if (action(r.value, i++) === false)
                    break;
            }
            return i;
        }
    }
    return -1;
}
exports.forEach = forEach;
/**
 * Converts any enumerable to an array.
 * @param source
 * @param max Stops after max is reached.  Allows for forEach to be called on infinite enumerations.
 * @returns {any}
 */
function toArray(source, max) {
    if (max === void 0) { max = Infinity; }
    if (source === STRING_EMPTY)
        return [];
    if (!isFinite(max) && (source) instanceof (Array))
        return source.slice();
    var result = initArrayFrom(source, max);
    if (-1 === forEach(source, function (e, i) { result[i] = e; }, max))
        throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException();
    return result;
}
exports.toArray = toArray;
/**
 * Converts any enumerable to an array of selected values.
 * @param source
 * @param selector
 * @param max Stops after max is reached.  Allows for forEach to be called on infinite enumerations.
 * @returns {TResult[]}
 */
function map(source, selector, max) {
    if (max === void 0) { max = Infinity; }
    if (source === STRING_EMPTY)
        return [];
    if (!isFinite(max) && (source) instanceof (Array))
        return source.map(selector);
    var result = initArrayFrom(source, max);
    if (-1 === forEach(source, function (e, i) { result[i] = selector(e, i); }, max))
        throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException();
    return result;
}
exports.map = map;
//# sourceMappingURL=Enumerator.js.map