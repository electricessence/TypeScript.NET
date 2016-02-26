/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var Types_1 = require('../../Types');
var Integer_1 = require('../../Integer');
var Compare_1 = require('../../Compare');
var ArgumentException_1 = require('../../Exceptions/ArgumentException');
var ArgumentNullException_1 = require('../../Exceptions/ArgumentNullException');
var ArgumentOutOfRangeException_1 = require('../../Exceptions/ArgumentOutOfRangeException');
function initialize(length) {
    Integer_1.default.assert(length, 'length');
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
    CBL0 = 'Cannot be less than zero.';
function copyTo(source, destination) {
    var sourceIndex = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var destinationIndex = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
    var length = arguments.length <= 4 || arguments[4] === undefined ? Infinity : arguments[4];

    if (!source) throw new ArgumentNullException_1.default('source', CBN);
    if (!destination) throw new ArgumentNullException_1.default('destination', CBN);
    if (sourceIndex < 0) throw new ArgumentOutOfRangeException_1.default('sourceIndex', sourceIndex, CBL0);
    var sourceLength = source.length;
    if (sourceIndex >= sourceLength) throw new ArgumentOutOfRangeException_1.default('sourceIndex', sourceIndex, 'Must be less than the length of the source array.');
    if (destination.length < 0) throw new ArgumentOutOfRangeException_1.default('destinationIndex', destinationIndex, CBL0);
    var maxLength = source.length - sourceIndex;
    if (isFinite(length) && length > maxLength) throw new ArgumentOutOfRangeException_1.default('sourceIndex', sourceIndex, 'Source index + length cannot exceed the length of the source array.');
    length = Math.min(length, maxLength);
    for (var i = 0; i < length; ++i) {
        destination[destinationIndex + i] = source[sourceIndex + i];
    }
    return destination;
}
exports.copyTo = copyTo;
function contains(array, item) {
    var equalityComparer = arguments.length <= 2 || arguments[2] === undefined ? Compare_1.areEqual : arguments[2];

    if (array && array.length) {
        if (Array.isArray(array)) return array.indexOf(item) != -1;
        for (var i = 0; i < array.length; ++i) {
            if (equalityComparer(array[i], item)) return true;
        }
    }
    return false;
}
exports.contains = contains;
function replace(array, old, newValue, max) {
    var count = 0;
    if (max !== 0) {
        if (!max) max = Infinity;else if (max < 0) throw new ArgumentOutOfRangeException_1.default('max', max, CBL0);
        for (var i = array.length - 1; i >= 0; --i) {
            if (array[i] === old) {
                array[i] = newValue;
                ++count;
                if (! --max) break;
            }
        }
    }
    return count;
}
exports.replace = replace;
function updateRange(array, value, index, length) {
    Integer_1.default.assert(index, 'index');
    Integer_1.default.assert(index, 'length');
    var end = index + length;
    for (var i = index; i < end; ++i) {
        array[i] = value;
    }
}
exports.updateRange = updateRange;
function clear(array, index, length) {
    updateRange(array, null, index, length);
}
exports.clear = clear;
function register(array, item) {
    var equalityComparer = arguments.length <= 2 || arguments[2] === undefined ? Compare_1.areEqual : arguments[2];

    if (!array) throw new ArgumentNullException_1.default('array', CBN);
    var len = array.length;
    var ok = !len || !contains(array, item, equalityComparer);
    if (ok) array[len] = item;
    return ok;
}
exports.register = register;
function findIndex(array, predicate) {
    if (!array) throw new ArgumentNullException_1.default('array', CBN);
    if (!Types_1.default.isFunction(predicate)) throw new ArgumentException_1.default('predicate', 'Must be a function.');
    var len = array.length;
    for (var i = 0; i < len; ++i) {
        if (i in array && predicate(array[i])) return i;
    }
    return -1;
}
exports.findIndex = findIndex;
function forEach(source, fn) {
    if (!source) throw new ArgumentNullException_1.default('source', CBN);
    if (fn) {
        for (var i = 0; i < source.length; ++i) {
            if (fn(source[i]) === false) break;
        }
    }
    return source;
}
exports.forEach = forEach;
function applyTo(target, fn) {
    if (!target) throw new ArgumentNullException_1.default('target', CBN);
    if (fn) {
        for (var i = 0; i < target.length; ++i) {
            target[i] = fn(target[i]);
        }
    }
    return target;
}
exports.applyTo = applyTo;
function removeIndex(array, index) {
    if (!array) throw new ArgumentNullException_1.default('array', CBN);
    Integer_1.default.assert(index, 'index');
    if (index < 0) throw new ArgumentOutOfRangeException_1.default('index', index, CBL0);
    var exists = index < array.length;
    if (exists) array.splice(index, 1);
    return exists;
}
exports.removeIndex = removeIndex;
function remove(array, value, max) {
    var equalityComparer = arguments.length <= 3 || arguments[3] === undefined ? Compare_1.areEqual : arguments[3];

    if (!array) throw new ArgumentNullException_1.default('array', CBN);
    var count = 0;
    if (array && array.length && max !== 0) {
        if (!max) max = Infinity;else if (max < 0) throw new ArgumentOutOfRangeException_1.default('max', max, CBL0);
        for (var i = array.length - 1; i >= 0; --i) {
            if (equalityComparer(array[i], value)) {
                array.splice(i, 1);
                ++count;
                if (! --max) break;
            }
        }
    }
    return count;
}
exports.remove = remove;
function repeat(element, count) {
    Integer_1.default.assert(count, 'count');
    if (count < 0) throw new ArgumentOutOfRangeException_1.default('count', count, CBL0);
    var result = [];
    while (count--) {
        result.push(element);
    }
    return result;
}
exports.repeat = repeat;
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
function dispatchUnsafe(listeners, payload, trap) {
    if (listeners && listeners.length) {
        for (var i = 0, len = listeners.length; i < len; i++) {
            var fn = listeners[i];
            if (!fn) continue;
            try {
                fn(payload);
            } catch (ex) {
                if (!trap) throw ex;else if (Types_1.default.isFunction(trap)) trap(ex, i);
            }
        }
    }
}
exports.dispatchUnsafe = dispatchUnsafe;
function dispatch(listeners, payload, trap) {
    dispatchUnsafe(copy(listeners), payload, trap);
}
exports.dispatch = dispatch;
function dispatchMapped(listeners, payload, trap) {
    if (!listeners) return null;
    var result = copy(listeners);
    if (listeners.length) {
        for (var i = 0, len = result.length; i < len; i++) {
            var fn = result[i];
            try {
                result[i] = fn ? fn(payload) : undefined;
            } catch (ex) {
                result[i] = undefined;
                if (!trap) throw ex;else if (Types_1.default.isFunction(trap)) trap(ex, i);
            }
        }
    }
    return result;
}
exports.dispatchMapped = dispatchMapped;
//# sourceMappingURL=Utility.js.map
