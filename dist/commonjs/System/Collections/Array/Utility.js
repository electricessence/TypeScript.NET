"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../../Types");
var Integer_1 = require("../../Integer");
var Compare_1 = require("../../Compare");
var ArgumentException_1 = require("../../Exceptions/ArgumentException");
var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
var ArgumentOutOfRangeException_1 = require("../../Exceptions/ArgumentOutOfRangeException");
var initialize_1 = require("./initialize");
exports.initialize = initialize_1.initialize;
var copy_1 = require("./copy");
exports.copy = copy_1.copy;
exports.copyTo = copy_1.copyTo;
var CBN = 'Cannot be null.', CB0 = 'Cannot be zero.', CBL0 = 'Cannot be less than zero.', VFN = 'Must be a valid finite number';
/**
 * Checks to see where the provided array contains an item/value.
 * If the array value is null, then -1 is returned.
 * @param array
 * @param item
 * @param {function?} equalityComparer
 * @returns {number}
 */
function indexOf(array, item, equalityComparer) {
    if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
    var len = array && array.length;
    if (len) {
        // NaN NEVER evaluates its equality so be careful.
        if (equalityComparer == Compare_1.areEqual && (array) instanceof (Array) && !Types_1.Type.isTrueNaN(item))
            return array.indexOf(item);
        for (var i = 0; i < len; i++) {
            // 'areEqual' includes NaN==NaN evaluation.
            if (equalityComparer(array[i], item))
                return i;
        }
    }
    return -1;
}
exports.indexOf = indexOf;
/**
 * Checks to see if the provided array contains an item.
 * If the array value is null, then false is returned.
 * @param array
 * @param item
 * @param {function?} equalityComparer
 * @returns {boolean}
 */
function contains(array, item, equalityComparer) {
    if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
    return indexOf(array, item, equalityComparer) != -1;
}
exports.contains = contains;
/**
 * Finds and replaces a value from an array.  Will replaces all instances unless a maximum is specified.
 * @param array
 * @param old
 * @param newValue
 * @param max
 * @returns {number}
 */
function replace(array, old, newValue, max) {
    if (max === void 0) { max = Infinity; }
    if (!array || !array.length || max === 0)
        return 0;
    if (max < 0)
        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('max', max, CBL0);
    if (!max)
        max = Infinity; // just in case.
    var count = 0;
    for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] === old) {
            array[i] = newValue;
            ++count;
            if (count == max)
                break;
        }
    }
    return count;
}
exports.replace = replace;
/**
 * Replaces values of an array across a range of indexes.
 * @param array
 * @param value
 * @param start
 * @param stop
 */
function updateRange(array, value, start, stop) {
    if (start === void 0) { start = 0; }
    if (!array)
        return;
    Integer_1.Integer.assertZeroOrGreater(start, 'start');
    if (!stop && stop !== 0)
        stop = array.length;
    Integer_1.Integer.assert(stop, 'stop');
    if (stop < start)
        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException("stop", stop, "is less than start");
    for (var i = start; i < stop; i++) {
        array[i] = value;
    }
}
exports.updateRange = updateRange;
/**
 * Clears (sets to null) values of an array across a range of indexes.
 * @param array
 * @param start
 * @param stop
 */
function clear(array, start, stop) {
    if (start === void 0) { start = 0; }
    updateRange(array, null, start, stop);
}
exports.clear = clear;
/**
 * Ensures a value exists within an array.  If not found, adds to the end.
 * @param array
 * @param item
 * @param {function?} equalityComparer
 * @returns {boolean}
 */
function register(array, item, equalityComparer) {
    if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
    if (!array)
        throw new ArgumentNullException_1.ArgumentNullException('array', CBN);
    var len = array.length; // avoid querying .length more than once. *
    var ok = !len || !contains(array, item, equalityComparer);
    if (ok)
        array[len] = item; // * push would query length again.
    return ok;
}
exports.register = register;
/**
 * Returns the first index of which the provided predicate returns true.
 * Returns -1 if always false.
 * @param array
 * @param predicate
 * @returns {number}
 */
function findIndex(array, predicate) {
    if (!array)
        throw new ArgumentNullException_1.ArgumentNullException('array', CBN);
    if (!Types_1.Type.isFunction(predicate))
        throw new ArgumentException_1.ArgumentException('predicate', 'Must be a function.');
    var len = array.length;
    if (!Types_1.Type.isNumber(len, true) || len < 0)
        throw new ArgumentException_1.ArgumentException('array', 'Does not have a valid length.');
    if ((array) instanceof (Array)) {
        for (var i = 0; i < len; i++) {
            if (predicate(array[i], i))
                return i;
        }
    }
    else {
        for (var i = 0; i < len; i++) {
            if ((i) in (array) && predicate(array[i], i))
                return i;
        }
    }
    return -1;
}
exports.findIndex = findIndex;
function forEach(source, action) {
    if (source && action) {
        // Don't cache the length since it is possible that the underlying array changed.
        for (var i = 0; i < source.length; i++) {
            if (action(source[i], i) === false)
                break;
        }
    }
}
exports.forEach = forEach;
/**
 * Is similar to Array.map() but instead of returning a new array, it updates the existing indexes.
 * Can also be applied to a structure that indexes like an array, but may not be.
 * @param target
 * @param fn
 */
function applyTo(target, fn) {
    if (target && fn) {
        for (var i = 0; i < target.length; i++) {
            target[i] = fn(target[i], i);
        }
    }
}
exports.applyTo = applyTo;
/**
 * Removes an entry at a specified index.
 * @param array
 * @param index
 * @returns {boolean} True if the value was able to be removed.
 */
function removeIndex(array, index) {
    if (!array)
        throw new ArgumentNullException_1.ArgumentNullException('array', CBN);
    Integer_1.Integer.assert(index, 'index');
    if (index < 0)
        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('index', index, CBL0);
    var exists = index < array.length;
    if (exists)
        array.splice(index, 1);
    return exists;
}
exports.removeIndex = removeIndex;
/**
 * Finds and removes a value from an array.  Will remove all instances unless a maximum is specified.
 * @param array
 * @param value
 * @param max
 * @param {function?} equalityComparer
 * @returns {number} The number of times the value was found and removed.
 */
function remove(array, value, max, equalityComparer) {
    if (max === void 0) { max = Infinity; }
    if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
    if (!array || !array.length || max === 0)
        return 0;
    if (max < 0)
        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('max', max, CBL0);
    var count = 0;
    if (!max || !isFinite(max)) {
        // Don't track the indexes and remove in reverse.
        for (var i = (array.length - 1); i >= 0; i--) {
            if (equalityComparer(array[i], value)) {
                array.splice(i, 1);
                ++count;
            }
        }
    }
    else {
        // Since the user will expect it to happen in forward order...
        var found = []; // indexes;
        for (var i = 0, len = array.length; i < len; i++) {
            if (equalityComparer(array[i], value)) {
                found.push(i);
                ++count;
                if (count == max)
                    break;
            }
        }
        for (var i = found.length - 1; i >= 0; i--) {
            array.splice(found[i], 1);
        }
    }
    return count;
}
exports.remove = remove;
/**
 * Simply repeats a value the number of times specified.
 * @param element
 * @param count
 * @returns {T[]}
 */
function repeat(element, count) {
    Integer_1.Integer.assert(count, 'count');
    if (count < 0)
        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('count', count, CBL0);
    var result = initialize_1.initialize(count);
    for (var i = 0; i < count; i++) {
        result[i] = element;
    }
    return result;
}
exports.repeat = repeat;
/**
 * Returns a range of numbers based upon the first value and the step value.
 * @param first
 * @param count
 * @param step
 * @returns {number[]}
 */
function range(first, count, step) {
    if (step === void 0) { step = 1; }
    if (isNaN(first) || !isFinite(first))
        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('first', first, VFN);
    if (isNaN(count) || !isFinite(count))
        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('count', count, VFN);
    if (count < 0)
        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('count', count, CBL0);
    var result = initialize_1.initialize(count);
    for (var i = 0; i < count; i++) {
        result[i] = first;
        first += step;
    }
    return result;
}
exports.range = range;
/**
 * Returns a range of numbers based upon the first value and the step value excluding any numbers at or beyond the until value.
 * @param first
 * @param until
 * @param step
 * @returns {number[]}
 */
function rangeUntil(first, until, step) {
    if (step === void 0) { step = 1; }
    if (step == 0)
        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('step', step, CB0);
    return range(first, (until - first) / step, step);
}
exports.rangeUntil = rangeUntil;
function distinct(source) {
    if (!source)
        return []; // Allowing for null facilitates regex filtering.
    var seen = {};
    return source.filter(function (e) { return !(e in seen) && (seen[e] = true); });
}
exports.distinct = distinct;
/**
 * Takes any arrays within an array and inserts the values contained within in place of that array.
 * For every count higher than 0 in recurseDepth it will attempt an additional pass.  Passing Infinity will flatten all arrays contained.
 * @param a
 * @param recurseDepth
 * @returns {any[]}
 */
function flatten(a, recurseDepth) {
    if (recurseDepth === void 0) { recurseDepth = 0; }
    var result = [];
    for (var i = 0; i < a.length; i++) {
        var x = a[i];
        if ((x) instanceof (Array)) {
            if (recurseDepth > 0)
                x = flatten(x, recurseDepth - 1);
            for (var n = 0; n < x.length; n++)
                result.push(x[n]);
        }
        else
            result.push(x);
    }
    return result;
}
exports.flatten = flatten;
//# sourceMappingURL=Utility.js.map