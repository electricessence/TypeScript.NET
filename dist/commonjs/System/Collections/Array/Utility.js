/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.initialize = initialize;
exports.copy = copy;
exports.copyTo = copyTo;
exports.contains = contains;
exports.replace = replace;
exports.updateRange = updateRange;
exports.clear = clear;
exports.register = register;
exports.findIndex = findIndex;
exports.forEach = forEach;
exports.applyTo = applyTo;
exports.removeIndex = removeIndex;
exports.remove = remove;
exports.repeat = repeat;
exports.flatten = flatten;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Types = require('../../Types');

var _Types2 = _interopRequireDefault(_Types);

var _Integer = require('../../Integer');

var _Integer2 = _interopRequireDefault(_Integer);

var _Compare = require('../../Compare');

var _ExceptionsArgumentException = require('../../Exceptions/ArgumentException');

var _ExceptionsArgumentException2 = _interopRequireDefault(_ExceptionsArgumentException);

var _ExceptionsArgumentNullException = require('../../Exceptions/ArgumentNullException');

var _ExceptionsArgumentNullException2 = _interopRequireDefault(_ExceptionsArgumentNullException);

var _ExceptionsArgumentOutOfRangeException = require('../../Exceptions/ArgumentOutOfRangeException');

var _ExceptionsArgumentOutOfRangeException2 = _interopRequireDefault(_ExceptionsArgumentOutOfRangeException);

function initialize(length) {
    _Integer2['default'].assert(length, 'length');
    var array;
    if (length > 65536) array = new Array(length);else {
        array = [];
        array.length = length;
    }
    return array;
}

function copy(source) {
    var sourceIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var length = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

    if (!source) return source;
    return copyTo(source, initialize(Math.min(length, Math.max(source.length - sourceIndex, 0))), sourceIndex, 0, length);
}

var CBN = 'Cannot be null.',
    CBL0 = 'Cannot be less than zero.';

function copyTo(source, destination) {
    var sourceIndex = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var destinationIndex = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
    var length = arguments.length <= 4 || arguments[4] === undefined ? Infinity : arguments[4];

    if (!source) throw new _ExceptionsArgumentNullException2['default']('source', CBN);
    if (!destination) throw new _ExceptionsArgumentNullException2['default']('destination', CBN);
    if (sourceIndex < 0) throw new _ExceptionsArgumentOutOfRangeException2['default']('sourceIndex', sourceIndex, CBL0);
    var sourceLength = source.length;
    if (sourceIndex >= sourceLength) throw new _ExceptionsArgumentOutOfRangeException2['default']('sourceIndex', sourceIndex, 'Must be less than the length of the source array.');
    if (destination.length < 0) throw new _ExceptionsArgumentOutOfRangeException2['default']('destinationIndex', destinationIndex, CBL0);
    var maxLength = source.length - sourceIndex;
    if (isFinite(length) && length > maxLength) throw new _ExceptionsArgumentOutOfRangeException2['default']('sourceIndex', sourceIndex, 'Source index + length cannot exceed the length of the source array.');
    length = Math.min(length, maxLength);
    for (var i = 0; i < length; ++i) {
        destination[destinationIndex + i] = source[sourceIndex + i];
    }
    return destination;
}

function contains(array, item) {
    var equalityComparer = arguments.length <= 2 || arguments[2] === undefined ? _Compare.areEqual : arguments[2];

    if (array && array.length) {
        if (array instanceof Array) return array.indexOf(item) != -1;
        for (var i = 0; i < array.length; ++i) {
            if (equalityComparer(array[i], item)) return true;
        }
    }
    return false;
}

function replace(array, old, newValue, max) {
    var count = 0;
    if (max !== 0) {
        if (!max) max = Infinity;else if (max < 0) throw new _ExceptionsArgumentOutOfRangeException2['default']('max', max, CBL0);
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

function updateRange(array, value, index, length) {
    _Integer2['default'].assert(index, 'index');
    _Integer2['default'].assert(index, 'length');
    var end = index + length;
    for (var i = index; i < end; ++i) {
        array[i] = value;
    }
}

function clear(array, index, length) {
    updateRange(array, null, index, length);
}

function register(array, item) {
    var equalityComparer = arguments.length <= 2 || arguments[2] === undefined ? _Compare.areEqual : arguments[2];

    if (!array) throw new _ExceptionsArgumentNullException2['default']('array', CBN);
    var len = array.length;
    var ok = !len || !contains(array, item, equalityComparer);
    if (ok) array[len] = item;
    return ok;
}

function findIndex(array, predicate) {
    if (!array) throw new _ExceptionsArgumentNullException2['default']('array', CBN);
    if (!_Types2['default'].isFunction(predicate)) throw new _ExceptionsArgumentException2['default']('predicate', 'Must be a function.');
    var len = array.length;
    for (var i = 0; i < len; ++i) {
        if (i in array && predicate(array[i])) return i;
    }
    return -1;
}

function forEach(source, fn) {
    if (!source) throw new _ExceptionsArgumentNullException2['default']('source', CBN);
    if (fn) {
        for (var i = 0; i < source.length; ++i) {
            if (fn(source[i]) === false) break;
        }
    }
    return source;
}

function applyTo(target, fn) {
    if (!target) throw new _ExceptionsArgumentNullException2['default']('target', CBN);
    if (fn) {
        for (var i = 0; i < target.length; ++i) {
            target[i] = fn(target[i]);
        }
    }
    return target;
}

function removeIndex(array, index) {
    if (!array) throw new _ExceptionsArgumentNullException2['default']('array', CBN);
    _Integer2['default'].assert(index, 'index');
    if (index < 0) throw new _ExceptionsArgumentOutOfRangeException2['default']('index', index, CBL0);
    var exists = index < array.length;
    if (exists) array.splice(index, 1);
    return exists;
}

function remove(array, value, max) {
    var equalityComparer = arguments.length <= 3 || arguments[3] === undefined ? _Compare.areEqual : arguments[3];

    if (!array) throw new _ExceptionsArgumentNullException2['default']('array', CBN);
    var count = 0;
    if (array && array.length && max !== 0) {
        if (!max) max = Infinity;else if (max < 0) throw new _ExceptionsArgumentOutOfRangeException2['default']('max', max, CBL0);
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

function repeat(element, count) {
    _Integer2['default'].assert(count, 'count');
    if (count < 0) throw new _ExceptionsArgumentOutOfRangeException2['default']('count', count, CBL0);
    var result = [];
    while (count--) {
        result.push(element);
    }
    return result;
}

function flatten(a) {
    var recurseDepth = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    var result = [];
    for (var i = 0; i < a.length; i++) {
        var x = a[i];
        if (x instanceof Array) {
            if (recurseDepth > 0) x = flatten(x, recurseDepth - 1);
            for (var n = 0; n < x.length; n++) result.push(x[n]);
        } else result.push(x);
    }
    return result;
}
//# sourceMappingURL=Utility.js.map
