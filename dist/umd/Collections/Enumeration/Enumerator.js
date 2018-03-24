/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./UnsupportedEnumerableException", "./ArrayEnumerator", "./IndexEnumerator", "../../Disposable/dispose", "./IteratorEnumerator", "./InfiniteEnumerator", "../../Reflection/isArrayLike", "../../Reflection/isPrimitive", "../../Reflection/hasMemberOfType", "./EmptyEnumerator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnsupportedEnumerableException_1 = require("./UnsupportedEnumerableException");
    var ArrayEnumerator_1 = require("./ArrayEnumerator");
    var IndexEnumerator_1 = require("./IndexEnumerator");
    var dispose_1 = require("../../Disposable/dispose");
    var IteratorEnumerator_1 = require("./IteratorEnumerator");
    var InfiniteEnumerator_1 = require("./InfiniteEnumerator");
    var isArrayLike_1 = require("../../Reflection/isArrayLike");
    var isPrimitive_1 = require("../../Reflection/isPrimitive");
    var hasMemberOfType_1 = require("../../Reflection/hasMemberOfType");
    var EmptyEnumerator_1 = require("./EmptyEnumerator");
    var STRING_EMPTY = "", ENDLESS_EXCEPTION_MESSAGE = 'Cannot call forEach on an endless enumerable. ' +
        'Would result in an infinite loop that could hang the current process.';
    function throwIfEndless(isEndless) {
        if (isEndless)
            throw new UnsupportedEnumerableException_1.default(ENDLESS_EXCEPTION_MESSAGE);
        return true;
    }
    exports.throwIfEndless = throwIfEndless;
    function initArrayFrom(source, max) {
        if (max === void 0) { max = Infinity; }
        if (isArrayLike_1.default(source)) {
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
            return EmptyEnumerator_1.default;
        if ((source) instanceof (Array))
            return new ArrayEnumerator_1.default(source);
        if (isArrayLike_1.default(source)) {
            return new IndexEnumerator_1.default(function () {
                return {
                    source: source,
                    length: source.length,
                    pointer: 0,
                    step: 1
                };
            });
        }
        if (!isPrimitive_1.default(source)) {
            if (isEnumerable(source))
                return source.getEnumerator();
            if (typeof source == 'function')
                return new InfiniteEnumerator_1.default(source);
            if (isEnumerator(source))
                return source;
            if (isIterator(source))
                return new IteratorEnumerator_1.default(source);
        }
        throw new UnsupportedEnumerableException_1.default();
    }
    exports.from = from;
    function isEnumerable(instance) {
        return hasMemberOfType_1.default(instance, "getEnumerator", "function" /* Function */);
    }
    exports.isEnumerable = isEnumerable;
    function isEnumerableOrArrayLike(instance) {
        return isArrayLike_1.default(instance) || isEnumerable(instance);
    }
    exports.isEnumerableOrArrayLike = isEnumerableOrArrayLike;
    function isEnumerator(instance) {
        return hasMemberOfType_1.default(instance, "moveNext", "function" /* Function */);
    }
    exports.isEnumerator = isEnumerator;
    function isIterator(instance) {
        return hasMemberOfType_1.default(instance, "next", "function" /* Function */);
    }
    exports.isIterator = isIterator;
    function forEach(e, action, max) {
        if (max === void 0) { max = Infinity; }
        if (e === STRING_EMPTY)
            return 0;
        if (e && max > 0) {
            if (isArrayLike_1.default(e)) {
                // Assume e.length is constant or at least doesn't deviate to infinite or NaN.
                throwIfEndless(!isFinite(max) && !isFinite(e.length));
                var i = 0;
                for (; i < Math.min(e.length, max); i++) {
                    if (action(e[i], i) === false)
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
            throw new UnsupportedEnumerableException_1.default();
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
            throw new UnsupportedEnumerableException_1.default();
        return result;
    }
    exports.map = map;
});
//# sourceMappingURL=Enumerator.js.map