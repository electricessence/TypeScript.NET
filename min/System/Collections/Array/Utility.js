/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
///<reference path="IArray.d.ts"/>
var Types = require('../../Types');
'use strict';
var Utility;
(function (Utility) {
    function initialize(length) {
        var array;
        if (length > 65536)
            array = new Array(length);
        else {
            array = [];
            array.length = length;
        }
        return array;
    }
    Utility.initialize = initialize;
    function copy(sourceArray, sourceIndex, length) {
        if (sourceIndex === void 0) { sourceIndex = 0; }
        if (length === void 0) { length = Infinity; }
        if (!sourceArray)
            return sourceArray;
        var sourceLength = sourceArray.length;
        return (sourceIndex || length < sourceLength)
            ? sourceArray.slice(sourceIndex, Math.min(length, sourceLength) - sourceLength)
            : sourceArray.slice(0);
    }
    Utility.copy = copy;
    function copyTo(sourceArray, destinationArray, sourceIndex, destinationIndex, length) {
        if (sourceIndex === void 0) { sourceIndex = 0; }
        if (destinationIndex === void 0) { destinationIndex = 0; }
        if (length === void 0) { length = Infinity; }
        if (!sourceArray)
            throw new Error("ArgumentNullException: source array cannot be null.");
        if (!destinationArray)
            throw new Error("ArgumentNullException: destination array cannot be null.");
        if (sourceIndex < 0)
            throw new Error("ArgumentOutOfRangeException: source index cannot be less than zero.");
        var sourceLength = sourceArray.length;
        if (sourceIndex >= sourceLength)
            throw new Error("ArgumentOutOfRangeException: the source index must be less than the length of the source array.");
        if (destinationArray.length < 0)
            throw new Error("ArgumentOutOfRangeException: destination index cannot be less than zero.");
        var maxLength = sourceArray.length - sourceIndex;
        if (isFinite(length) && length > maxLength)
            throw new Error("ArgumentOutOfRangeException: source index + length cannot exceed the length of the source array.");
        length = Math.min(length, maxLength);
        for (var i = 0; i < length; ++i) {
            destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
        }
    }
    Utility.copyTo = copyTo;
    function contains(array, item) {
        return !array ? false : array.indexOf(item) != -1;
    }
    Utility.contains = contains;
    function replace(array, old, newValue, max) {
        var count = 0 | 0;
        if (max !== 0) {
            if (!max)
                max = Infinity;
            for (var i = (array.length - 1) | 0; i >= 0; --i) {
                if (array[i] === old) {
                    array[i] = newValue;
                    ++count;
                    if (!--max)
                        break;
                }
            }
        }
        return count;
    }
    Utility.replace = replace;
    function updateRange(array, value, index, length) {
        var end = index + length;
        for (var i = index; i < end; ++i) {
            array[i] = value;
        }
    }
    Utility.updateRange = updateRange;
    function clear(array, index, length) {
        updateRange(array, null, index, length);
    }
    Utility.clear = clear;
    function register(array, item) {
        if (!array)
            throw new Error("ArgumentNullException: 'array' cannot be null.");
        var len = array.length;
        var ok = !len || !contains(array, item);
        if (ok)
            array[len] = item;
        return ok;
    }
    Utility.register = register;
    function findIndex(array, predicate) {
        if (!array)
            throw new Error("ArgumentNullException: 'array' cannot be null.");
        if (!Types.isFunction(predicate))
            throw new Error("InvalidArgumentException: 'predicate' must be a function.");
        var len = array.length | 0;
        for (var i = 0 | 0; i < len; ++i) {
            if (i in array && predicate(array[i]))
                return i;
        }
        return -1;
    }
    Utility.findIndex = findIndex;
    function forEach(sourceArray, fn) {
        sourceArray.every(function (value, index) { return fn(value, index) !== false; });
    }
    Utility.forEach = forEach;
    function applyTo(target, fn) {
        if (!target)
            throw new Error("ArgumentNullException: 'target' cannot be null.");
        if (fn) {
            for (var i = 0 | 0; i < target.length; ++i) {
                target[i] = fn(target[i]);
            }
        }
        return target;
    }
    Utility.applyTo = applyTo;
    function removeIndex(array, index) {
        if (!array)
            throw new Error("ArgumentNullException: 'array' cannot be null.");
        var exists = index < array.length;
        if (exists)
            array.splice(index, 1);
        return exists;
    }
    Utility.removeIndex = removeIndex;
    function remove(array, value, max) {
        if (!array)
            throw new Error("ArgumentNullException: 'array' cannot be null.");
        var count = 0;
        if (array && array.length && max !== 0) {
            if (!max)
                max = Infinity;
            for (var i = (array.length - 1) | 0; i >= 0; --i) {
                if (array[i] === value) {
                    array.splice(i, 1);
                    ++count;
                    if (!--max)
                        break;
                }
            }
        }
        return count;
    }
    Utility.remove = remove;
    function repeat(element, count) {
        var result = [];
        while (count--) {
            result.push(element);
        }
        return result;
    }
    Utility.repeat = repeat;
})(Utility || (Utility = {}));
module.exports = Utility;
