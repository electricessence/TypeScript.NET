/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import UnsupportedEnumerableException from "./UnsupportedEnumerableException";
import ArrayEnumerator from "./ArrayEnumerator";
import IndexEnumerator from "./IndexEnumerator";
import { using } from "../../Disposable/dispose";
import IteratorEnumerator from "./IteratorEnumerator";
import InfiniteEnumerator from "./InfiniteEnumerator";
import isArrayLike from "../../Reflection/isArrayLike";
import isPrimitive from "../../Reflection/isPrimitive";
import hasMemberOfType from "../../Reflection/hasMemberOfType";
import EmptyEnumerator from "./EmptyEnumerator";
var STRING_EMPTY = "", ENDLESS_EXCEPTION_MESSAGE = 'Cannot call forEach on an endless enumerable. ' +
    'Would result in an infinite loop that could hang the current process.';
export function throwIfEndless(isEndless) {
    if (isEndless)
        throw new UnsupportedEnumerableException(ENDLESS_EXCEPTION_MESSAGE);
    return true;
}
function initArrayFrom(source, max) {
    if (max === void 0) { max = Infinity; }
    if (isArrayLike(source)) {
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
export function from(source) {
    // To simplify and prevent null reference exceptions:
    if (!source)
        return EmptyEnumerator;
    if ((source) instanceof (Array))
        return new ArrayEnumerator(source);
    if (isArrayLike(source)) {
        return new IndexEnumerator(function () {
            return {
                source: source,
                length: source.length,
                pointer: 0,
                step: 1
            };
        });
    }
    if (!isPrimitive(source)) {
        if (isEnumerable(source))
            return source.getEnumerator();
        if (typeof source == 'function')
            return new InfiniteEnumerator(source);
        if (isEnumerator(source))
            return source;
        if (isIterator(source))
            return new IteratorEnumerator(source);
    }
    throw new UnsupportedEnumerableException();
}
export function isEnumerable(instance) {
    return hasMemberOfType(instance, "getEnumerator", "function" /* Function */);
}
export function isEnumerableOrArrayLike(instance) {
    return isArrayLike(instance) || isEnumerable(instance);
}
export function isEnumerator(instance) {
    return hasMemberOfType(instance, "moveNext", "function" /* Function */);
}
export function isIterator(instance) {
    return hasMemberOfType(instance, "next", "function" /* Function */);
}
export function forEach(e, action, max) {
    if (max === void 0) { max = Infinity; }
    if (e === STRING_EMPTY)
        return 0;
    if (e && max > 0) {
        if (isArrayLike(e)) {
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
            return using(e.getEnumerator(), function (f) { return forEach(f, action, max); });
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
/**
 * Converts any enumerable to an array.
 * @param source
 * @param max Stops after max is reached.  Allows for forEach to be called on infinite enumerations.
 * @returns {any}
 */
export function toArray(source, max) {
    if (max === void 0) { max = Infinity; }
    if (source === STRING_EMPTY)
        return [];
    if (!isFinite(max) && (source) instanceof (Array))
        return source.slice();
    var result = initArrayFrom(source, max);
    if (-1 === forEach(source, function (e, i) { result[i] = e; }, max))
        throw new UnsupportedEnumerableException();
    return result;
}
/**
 * Converts any enumerable to an array of selected values.
 * @param source
 * @param selector
 * @param max Stops after max is reached.  Allows for forEach to be called on infinite enumerations.
 * @returns {TResult[]}
 */
export function map(source, selector, max) {
    if (max === void 0) { max = Infinity; }
    if (source === STRING_EMPTY)
        return [];
    if (!isFinite(max) && (source) instanceof (Array))
        return source.map(selector);
    var result = initArrayFrom(source, max);
    if (-1 === forEach(source, function (e, i) { result[i] = selector(e, i); }, max))
        throw new UnsupportedEnumerableException();
    return result;
}
//# sourceMappingURL=Enumerator.js.map