/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['../../Types', '../../Integer', '../../Compare', '../../Exceptions/ArgumentException', '../../Exceptions/ArgumentNullException', '../../Exceptions/ArgumentOutOfRangeException'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1, Integer_1, Compare_1, ArgumentException_1, ArgumentNullException_1, ArgumentOutOfRangeException_1;
    var CBN, CBL0;
    function initialize(length) {
        Integer_1.default.assert(length, 'length');
        var array;
        if (length > 65536)
            array = new Array(length);
        else {
            array = [];
            array.length = length;
        }
        return array;
    }
    exports_1("initialize", initialize);
    function copy(source, sourceIndex, length) {
        if (sourceIndex === void 0) { sourceIndex = 0; }
        if (length === void 0) { length = Infinity; }
        if (!source)
            return source;
        return copyTo(source, initialize(Math.min(length, Math.max(source.length - sourceIndex, 0))), sourceIndex, 0, length);
    }
    exports_1("copy", copy);
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
    exports_1("copyTo", copyTo);
    function contains(array, item, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
        if (array && array.length) {
            if (Array.isArray(array))
                return array.indexOf(item) != -1;
            for (var i = 0; i < array.length; ++i) {
                if (equalityComparer(array[i], item))
                    return true;
            }
        }
        return false;
    }
    exports_1("contains", contains);
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
    exports_1("replace", replace);
    function updateRange(array, value, index, length) {
        Integer_1.default.assert(index, 'index');
        Integer_1.default.assert(index, 'length');
        var end = index + length;
        for (var i = index; i < end; ++i) {
            array[i] = value;
        }
    }
    exports_1("updateRange", updateRange);
    function clear(array, index, length) {
        updateRange(array, null, index, length);
    }
    exports_1("clear", clear);
    function register(array, item, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
        if (!array)
            throw new ArgumentNullException_1.default('array', CBN);
        var len = array.length;
        var ok = !len || !contains(array, item, equalityComparer);
        if (ok)
            array[len] = item;
        return ok;
    }
    exports_1("register", register);
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
    exports_1("findIndex", findIndex);
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
    exports_1("forEach", forEach);
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
    exports_1("applyTo", applyTo);
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
    exports_1("removeIndex", removeIndex);
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
    exports_1("remove", remove);
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
    exports_1("repeat", repeat);
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
    exports_1("flatten", flatten);
    function dispatchUnsafe(listeners, payload, trap) {
        if (listeners && listeners.length) {
            for (var i = 0, len = listeners.length; i < len; i++) {
                var fn = listeners[i];
                if (!fn)
                    continue;
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
    exports_1("dispatchUnsafe", dispatchUnsafe);
    function dispatch(listeners, payload, trap) {
        dispatchUnsafe(copy(listeners), payload, trap);
    }
    exports_1("dispatch", dispatch);
    function dispatchMapped(listeners, payload, trap) {
        if (!listeners)
            return null;
        var result = copy(listeners);
        if (listeners.length) {
            for (var i = 0, len = result.length; i < len; i++) {
                var fn = result[i];
                try {
                    result[i] = fn
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
    exports_1("dispatchMapped", dispatchMapped);
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (Integer_1_1) {
                Integer_1 = Integer_1_1;
            },
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            },
            function (ArgumentException_1_1) {
                ArgumentException_1 = ArgumentException_1_1;
            },
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (ArgumentOutOfRangeException_1_1) {
                ArgumentOutOfRangeException_1 = ArgumentOutOfRangeException_1_1;
            }],
        execute: function() {
            CBN = 'Cannot be null.', CBL0 = 'Cannot be less than zero.';
        }
    }
});
//# sourceMappingURL=Utility.js.map