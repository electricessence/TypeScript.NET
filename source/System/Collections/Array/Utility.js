(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../../Types', '../../Integer', '../../Compare', '../../Exceptions/ArgumentException', '../../Exceptions/ArgumentNullException', '../../Exceptions/ArgumentOutOfRangeException'], factory);
    }
})(function (require, exports) {
    "use strict";
    /*
     * @author electricessence / https://github.com/electricessence/
     * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
     */
    ///<reference path="IArray.d.ts"/>
    ///<reference path="../../FunctionTypes.d.ts"/>
    var Types_1 = require('../../Types');
    var Integer_1 = require('../../Integer');
    var Compare_1 = require('../../Compare');
    var ArgumentException_1 = require('../../Exceptions/ArgumentException');
    var ArgumentNullException_1 = require('../../Exceptions/ArgumentNullException');
    var ArgumentOutOfRangeException_1 = require('../../Exceptions/ArgumentOutOfRangeException');
    /**
     * Initializes an array depending on the requested capacity.
     * The returned array will have a .length equal to the value provided.
     * @param length
     * @returns {T[]}
     */
    function initialize(length) {
        Integer_1.default.assert(length, 'length');
        // This logic is based upon JS performance tests that show a significant difference at the level of 65536.
        var array;
        if (length > 65536)
            array = new Array(length);
        else {
            array = [];
            array.length = length;
        }
        return array;
    }
    exports.initialize = initialize;
    /**
     *
     * @param source
     * @param sourceIndex
     * @param length
     * @returns {any}
     */
    function copy(source, sourceIndex, length) {
        if (sourceIndex === void 0) { sourceIndex = 0; }
        if (length === void 0) { length = Infinity; }
        if (!source)
            return source; // may have passed zero? undefined? or null?
        return copyTo(source, initialize(Math.min(length, Math.max(source.length - sourceIndex, 0))), sourceIndex, 0, length);
    }
    exports.copy = copy;
    var CBN = 'Cannot be null.', CBL0 = 'Cannot be less than zero.';
    /**
     * Copies one array to another.
     * @param source
     * @param destination
     * @param sourceIndex
     * @param destinationIndex
     * @param length An optional limit to stop copying.
     * @returns The destination array.
     */
    function copyTo(source, destination, sourceIndex, destinationIndex, length) {
        if (sourceIndex === void 0) { sourceIndex = 0; }
        if (destinationIndex === void 0) { destinationIndex = 0; }
        if (length === void 0) { length = Infinity; }
        if (!source)
            throw new ArgumentNullException_1.default('source', CBN);
        if (!destination)
            throw new ArgumentNullException_1.default('destination', CBN);
        if (sourceIndex < 0)
            throw new ArgumentOutOfRangeException_1.default('sourceIndex', sourceIndex, CBL0);
        var sourceLength = source.length;
        if (sourceIndex >= sourceLength)
            throw new ArgumentOutOfRangeException_1.default('sourceIndex', sourceIndex, 'Must be less than the length of the source array.');
        if (destination.length < 0)
            throw new ArgumentOutOfRangeException_1.default('destinationIndex', destinationIndex, CBL0);
        var maxLength = source.length - sourceIndex;
        if (isFinite(length) && length > maxLength)
            throw new ArgumentOutOfRangeException_1.default('sourceIndex', sourceIndex, 'Source index + length cannot exceed the length of the source array.');
        length = Math.min(length, maxLength);
        for (var i = 0; i < length; ++i) {
            destination[destinationIndex + i] = source[sourceIndex + i];
        }
        return destination;
    }
    exports.copyTo = copyTo;
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
        if (array && array.length) {
            if (Array.isArray(array))
                return array.indexOf(item) != -1;
            for (var i = 0; i < array.length; ++i) {
                // 'areEqual' includes NaN==NaN evaluation.
                if (equalityComparer(array[i], item))
                    return true;
            }
        }
        return false;
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
        var count = 0;
        if (max !== 0) {
            if (!max)
                max = Infinity;
            else if (max < 0)
                throw new ArgumentOutOfRangeException_1.default('max', max, CBL0);
            for (var i = (array.length - 1); i >= 0; --i) {
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
    exports.replace = replace;
    /**
     * Replaces values of an array across a range of indexes.
     * @param array
     * @param value
     * @param index
     * @param length
     */
    function updateRange(array, value, index, length) {
        Integer_1.default.assert(index, 'index');
        Integer_1.default.assert(index, 'length');
        var end = index + length;
        for (var i = index; i < end; ++i) {
            array[i] = value;
        }
    }
    exports.updateRange = updateRange;
    /**
     * Clears (sets to null) values of an array across a range of indexes.
     * @param array
     * @param index
     * @param length
     */
    function clear(array, index, length) {
        updateRange(array, null, index, length);
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
            throw new ArgumentNullException_1.default('array', CBN);
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
            throw new ArgumentNullException_1.default('array', CBN);
        if (!Types_1.default.isFunction(predicate))
            throw new ArgumentException_1.default('predicate', 'Must be a function.');
        var len = array.length;
        for (var i = 0; i < len; ++i) {
            if ((i) in (array) && predicate(array[i]))
                return i;
        }
        return -1;
    }
    exports.findIndex = findIndex;
    /**
     * Allows for using "false" to cause forEach to break.
     * Can also be applied to a structure that indexes like an array, but may not be.
     * @param source
     * @param fn
     * @returns {IArray<T>}
     */
    function forEach(source, fn) {
        if (!source)
            throw new ArgumentNullException_1.default('source', CBN);
        if (fn) {
            for (var i = 0; i < source.length; ++i) {
                if (fn(source[i]) === false)
                    break;
            }
        }
        return source;
    }
    exports.forEach = forEach;
    /**
     * Is similar to Array.map() but instead of returning a new array, it updates the existing indexes.
     * Can also be applied to a structure that indexes like an array, but may not be.
     * @param target
     * @param fn
     * @returns {IArray<T>}
     */
    function applyTo(target, fn) {
        if (!target)
            throw new ArgumentNullException_1.default('target', CBN);
        if (fn) {
            for (var i = 0; i < target.length; ++i) {
                target[i] = fn(target[i]);
            }
        }
        return target;
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
            throw new ArgumentNullException_1.default('array', CBN);
        Integer_1.default.assert(index, 'index');
        if (index < 0)
            throw new ArgumentOutOfRangeException_1.default('index', index, CBL0);
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
        if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
        if (!array)
            throw new ArgumentNullException_1.default('array', CBN);
        var count = 0;
        if (array && array.length && max !== 0) {
            if (!max)
                max = Infinity;
            else if (max < 0)
                throw new ArgumentOutOfRangeException_1.default('max', max, CBL0);
            for (var i = (array.length - 1); i >= 0; --i) {
                if (equalityComparer(array[i], value)) {
                    array.splice(i, 1);
                    ++count;
                    if (!--max)
                        break;
                }
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
        Integer_1.default.assert(count, 'count');
        if (count < 0)
            throw new ArgumentOutOfRangeException_1.default('count', count, CBL0);
        var result = [];
        while (count--) {
            result.push(element);
        }
        return result;
    }
    exports.repeat = repeat;
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
            if (Array.isArray(x)) {
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
    /**
     * Simply takes a payload and passes it to all the listeners.
     *
     * While dispatching:
     * * This is an unsafe method if by chance any of the listeners modify the array.
     * * It cannot prevent changes to the payload.
     *
     * Improving safety:
     * * Only use a local array that isn't exposed to the listeners.
     * * Use the dispatch method instead as it makes a copy of the listeners array.
     * * Freeze the listeners array so it can't be modified.
     * * Freeze the payload.
     *
     * Specifying trap will catch any errors and pass them along if trap is a function.
     * A payload is used instead of arguments for easy typing.
     *
     *
     * @param listeners
     * @param payload
     * @param trap
     */
    function dispatchUnsafe(listeners, payload, trap) {
        if (listeners && listeners.length) {
            for (var i = 0, len = listeners.length; i < len; i++) {
                var fn = listeners[i];
                if (!fn)
                    continue; // Ignore null refs.
                try {
                    fn(payload);
                }
                catch (ex) {
                    if (!trap)
                        throw ex;
                    else if (Types_1.default.isFunction(trap))
                        trap(ex, i);
                }
            }
        }
    }
    exports.dispatchUnsafe = dispatchUnsafe;
    /**
     * Simply takes a payload and passes it to all the listeners.
     * Makes a copy of the listeners before calling dispatchUnsafe.
     *
     * @param listeners
     * @param payload
     * @param trap
     */
    function dispatch(listeners, payload, trap) {
        dispatchUnsafe(copy(listeners), payload, trap);
    }
    exports.dispatch = dispatch;
    /**
     * Simply takes a payload and passes it to all the listeners.
     * Returns the results in an array that matches the indexes of the listeners.
     *
     * @param listeners
     * @param payload
     * @param trap
     * @returns {any}
     */
    function dispatchMapped(listeners, payload, trap) {
        if (!listeners)
            return null;
        // Reuse the copy as the array result.
        var result = copy(listeners);
        if (listeners.length) {
            for (var i = 0, len = result.length; i < len; i++) {
                var fn = result[i];
                try {
                    result[i] = fn // Ignore null refs.
                        ? fn(payload)
                        : undefined;
                }
                catch (ex) {
                    result[i] = undefined;
                    if (!trap)
                        throw ex;
                    else if (Types_1.default.isFunction(trap))
                        trap(ex, i);
                }
            }
        }
        return result;
    }
    exports.dispatchMapped = dispatchMapped;
});
//# sourceMappingURL=Utility.js.map