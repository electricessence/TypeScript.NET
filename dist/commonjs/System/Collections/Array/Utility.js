/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var Types_1 = require("../../Types");
var Integer_1 = require("../../Integer");
var Compare_1 = require("../../Compare");
var ArgumentException_1 = require("../../Exceptions/ArgumentException");
var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
var ArgumentOutOfRangeException_1 = require("../../Exceptions/ArgumentOutOfRangeException");
function initialize(length) {
    Integer_1.Integer.assert(length, 'length');
    var array;
    if (length > 65536) array = new Array(length);else {
        array = [];
        array.length = length;
    }
    return array;
}
exports.initialize = initialize;
function copy(source) {
    var sourceIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var length = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

    if (!source) return source;
    return copyTo(source, initialize(Math.min(length, Math.max(source.length - sourceIndex, 0))), sourceIndex, 0, length);
}
exports.copy = copy;
var CBN = 'Cannot be null.',
    CB0 = 'Cannot be zero.',
    CBL0 = 'Cannot be less than zero.',
    VFN = 'Must be a valid finite number';
function copyTo(source, destination) {
    var sourceIndex = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var destinationIndex = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
    var length = arguments.length <= 4 || arguments[4] === undefined ? Infinity : arguments[4];

    if (!source) throw new ArgumentNullException_1.ArgumentNullException('source', CBN);
    if (!destination) throw new ArgumentNullException_1.ArgumentNullException('destination', CBN);
    if (sourceIndex < 0) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('sourceIndex', sourceIndex, CBL0);
    var sourceLength = source.length;
    if (!sourceLength) return destination;
    if (sourceIndex >= sourceLength) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('sourceIndex', sourceIndex, 'Must be less than the length of the source array.');
    if (destination.length < 0) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('destinationIndex', destinationIndex, CBL0);
    var maxLength = source.length - sourceIndex;
    if (isFinite(length) && length > maxLength) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('sourceIndex', sourceIndex, 'Source index + length cannot exceed the length of the source array.');
    length = Math.min(length, maxLength);
    var newLength = destinationIndex + length;
    if (newLength > destination.length) destination.length = newLength;
    for (var i = 0; i < length; i++) {
        destination[destinationIndex + i] = source[sourceIndex + i];
    }
    return destination;
}
exports.copyTo = copyTo;
function indexOf(array, item) {
    var equalityComparer = arguments.length <= 2 || arguments[2] === undefined ? Compare_1.areEqual : arguments[2];

    var len = array && array.length;
    if (len) {
        if (Array.isArray(array) && !Types_1.Type.isTrueNaN(item)) return array.indexOf(item);
        for (var i = 0; i < len; i++) {
            if (equalityComparer(array[i], item)) return i;
        }
    }
    return -1;
}
exports.indexOf = indexOf;
function contains(array, item) {
    var equalityComparer = arguments.length <= 2 || arguments[2] === undefined ? Compare_1.areEqual : arguments[2];

    return indexOf(array, item, equalityComparer) != -1;
}
exports.contains = contains;
function replace(array, old, newValue, max) {
    if (!array || !array.length || max === 0) return 0;
    if (max < 0) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('max', max, CBL0);
    if (!max) max = Infinity;
    var count = 0;
    for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] === old) {
            array[i] = newValue;
            ++count;
            if (count == max) break;
        }
    }
    return count;
}
exports.replace = replace;
function updateRange(array, value) {
    var start = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var stop = arguments[3];

    if (!array) return;
    Integer_1.Integer.assertZeroOrGreater(start, 'start');
    if (!stop && stop !== 0) stop = array.length;
    Integer_1.Integer.assert(stop, 'stop');
    if (stop < start) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException("stop", stop, "is less than start");
    for (var i = start; i < stop; i++) {
        array[i] = value;
    }
}
exports.updateRange = updateRange;
function clear(array) {
    var start = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var stop = arguments[2];

    updateRange(array, null, start, stop);
}
exports.clear = clear;
function register(array, item) {
    var equalityComparer = arguments.length <= 2 || arguments[2] === undefined ? Compare_1.areEqual : arguments[2];

    if (!array) throw new ArgumentNullException_1.ArgumentNullException('array', CBN);
    var len = array.length;
    var ok = !len || !contains(array, item, equalityComparer);
    if (ok) array[len] = item;
    return ok;
}
exports.register = register;
function findIndex(array, predicate) {
    if (!array) throw new ArgumentNullException_1.ArgumentNullException('array', CBN);
    if (!Types_1.Type.isFunction(predicate)) throw new ArgumentException_1.ArgumentException('predicate', 'Must be a function.');
    var len = array.length;
    if (Array.isArray(array)) {
        for (var i = 0; i < len; i++) {
            if (predicate(array[i])) return i;
        }
    } else {
        for (var _i = 0; _i < len; _i++) {
            if (_i in array && predicate(array[_i])) return _i;
        }
    }
    return -1;
}
exports.findIndex = findIndex;
function forEach(source, action) {
    if (source && action) {
        for (var i = 0; i < source.length; i++) {
            if (action(source[i], i) === false) break;
        }
    }
}
exports.forEach = forEach;
function applyTo(target, fn) {
    if (target && fn) {
        for (var i = 0; i < target.length; i++) {
            target[i] = fn(target[i]);
        }
    }
}
exports.applyTo = applyTo;
function removeIndex(array, index) {
    if (!array) throw new ArgumentNullException_1.ArgumentNullException('array', CBN);
    Integer_1.Integer.assert(index, 'index');
    if (index < 0) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('index', index, CBL0);
    var exists = index < array.length;
    if (exists) array.splice(index, 1);
    return exists;
}
exports.removeIndex = removeIndex;
function remove(array, value, max) {
    var equalityComparer = arguments.length <= 3 || arguments[3] === undefined ? Compare_1.areEqual : arguments[3];

    if (!array || !array.length || max === 0) return 0;
    if (max < 0) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('max', max, CBL0);
    var count = 0;
    if (!max || !isFinite(max)) {
        for (var i = array.length - 1; i >= 0; i--) {
            if (equalityComparer(array[i], value)) {
                array.splice(i, 1);
                ++count;
            }
        }
    } else {
        var found = [];
        for (var _i2 = 0, len = array.length; _i2 < len; _i2++) {
            if (equalityComparer(array[_i2], value)) {
                found.push(_i2);
                ++count;
                if (count == max) break;
            }
        }
        for (var _i3 = found.length - 1; _i3 >= 0; _i3--) {
            array.splice(found[_i3], 1);
        }
    }
    return count;
}
exports.remove = remove;
function repeat(element, count) {
    Integer_1.Integer.assert(count, 'count');
    if (count < 0) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('count', count, CBL0);
    var result = initialize(count);
    for (var i = 0; i < count; i++) {
        result[i] = element;
    }
    return result;
}
exports.repeat = repeat;
function range(first, count) {
    var step = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    if (isNaN(first) || !isFinite(first)) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('first', first, VFN);
    if (isNaN(count) || !isFinite(count)) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('count', count, VFN);
    if (count < 0) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('count', count, CBL0);
    var result = initialize(count);
    for (var i = 0; i < count; i++) {
        result[i] = first;
        first += step;
    }
    return result;
}
exports.range = range;
function rangeUntil(first, until) {
    var step = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    if (step == 0) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('step', step, CB0);
    return range(first, (until - first) / step, step);
}
exports.rangeUntil = rangeUntil;
function distinct(source) {
    var seen = {};
    return source.filter(function (e) {
        return !(e in seen) && (seen[e] = true);
    });
}
exports.distinct = distinct;
function flatten(a) {
    var recurseDepth = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    var result = [];
    for (var i = 0; i < a.length; i++) {
        var x = a[i];
        if (Array.isArray(x)) {
            if (recurseDepth > 0) x = flatten(x, recurseDepth - 1);
            for (var n = 0; n < x.length; n++) {
                result.push(x[n]);
            }
        } else result.push(x);
    }
    return result;
}
exports.flatten = flatten;
//# sourceMappingURL=Utility.js.map
