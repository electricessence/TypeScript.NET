/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import Type from '../../Types';
import Integer from '../../Integer';
import { areEqual } from '../../Compare';
import ArgumentException from '../../Exceptions/ArgumentException';
import ArgumentNullException from '../../Exceptions/ArgumentNullException';
import ArgumentOutOfRangeException from '../../Exceptions/ArgumentOutOfRangeException';
export function initialize(length) {
    Integer.assert(length, 'length');
    var array;
    if (length > 65536)
        array = new Array(length);
    else {
        array = [];
        array.length = length;
    }
    return array;
}
export function copy(source, sourceIndex = 0, length = Infinity) {
    if (!source)
        return source;
    return copyTo(source, initialize(Math.min(length, Math.max(source.length - sourceIndex, 0))), sourceIndex, 0, length);
}
const CBN = 'Cannot be null.', CBL0 = 'Cannot be less than zero.';
export function copyTo(source, destination, sourceIndex = 0, destinationIndex = 0, length = Infinity) {
    if (!source)
        throw new ArgumentNullException('source', CBN);
    if (!destination)
        throw new ArgumentNullException('destination', CBN);
    if (sourceIndex < 0)
        throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, CBL0);
    var sourceLength = source.length;
    if (sourceIndex >= sourceLength)
        throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, 'Must be less than the length of the source array.');
    if (destination.length < 0)
        throw new ArgumentOutOfRangeException('destinationIndex', destinationIndex, CBL0);
    var maxLength = source.length - sourceIndex;
    if (isFinite(length) && length > maxLength)
        throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, 'Source index + length cannot exceed the length of the source array.');
    length = Math.min(length, maxLength);
    for (let i = 0; i < length; ++i) {
        destination[destinationIndex + i] = source[sourceIndex + i];
    }
    return destination;
}
export function contains(array, item, equalityComparer = areEqual) {
    if (array && array.length) {
        if (Array.isArray(array))
            return array.indexOf(item) != -1;
        for (let i = 0; i < array.length; ++i) {
            if (equalityComparer(array[i], item))
                return true;
        }
    }
    return false;
}
export function replace(array, old, newValue, max) {
    var count = 0;
    if (max !== 0) {
        if (!max)
            max = Infinity;
        else if (max < 0)
            throw new ArgumentOutOfRangeException('max', max, CBL0);
        for (let i = (array.length - 1); i >= 0; --i) {
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
export function updateRange(array, value, index, length) {
    Integer.assert(index, 'index');
    Integer.assert(index, 'length');
    var end = index + length;
    for (let i = index; i < end; ++i) {
        array[i] = value;
    }
}
export function clear(array, index, length) {
    updateRange(array, null, index, length);
}
export function register(array, item, equalityComparer = areEqual) {
    if (!array)
        throw new ArgumentNullException('array', CBN);
    var len = array.length;
    var ok = !len || !contains(array, item, equalityComparer);
    if (ok)
        array[len] = item;
    return ok;
}
export function findIndex(array, predicate) {
    if (!array)
        throw new ArgumentNullException('array', CBN);
    if (!Type.isFunction(predicate))
        throw new ArgumentException('predicate', 'Must be a function.');
    var len = array.length;
    for (let i = 0; i < len; ++i) {
        if ((i) in (array) && predicate(array[i]))
            return i;
    }
    return -1;
}
export function forEach(source, fn) {
    if (!source)
        throw new ArgumentNullException('source', CBN);
    if (fn) {
        for (let i = 0; i < source.length; ++i) {
            if (fn(source[i]) === false)
                break;
        }
    }
    return source;
}
export function applyTo(target, fn) {
    if (!target)
        throw new ArgumentNullException('target', CBN);
    if (fn) {
        for (let i = 0; i < target.length; ++i) {
            target[i] = fn(target[i]);
        }
    }
    return target;
}
export function removeIndex(array, index) {
    if (!array)
        throw new ArgumentNullException('array', CBN);
    Integer.assert(index, 'index');
    if (index < 0)
        throw new ArgumentOutOfRangeException('index', index, CBL0);
    var exists = index < array.length;
    if (exists)
        array.splice(index, 1);
    return exists;
}
export function remove(array, value, max, equalityComparer = areEqual) {
    if (!array)
        throw new ArgumentNullException('array', CBN);
    var count = 0;
    if (array && array.length && max !== 0) {
        if (!max)
            max = Infinity;
        else if (max < 0)
            throw new ArgumentOutOfRangeException('max', max, CBL0);
        for (let i = (array.length - 1); i >= 0; --i) {
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
export function repeat(element, count) {
    Integer.assert(count, 'count');
    if (count < 0)
        throw new ArgumentOutOfRangeException('count', count, CBL0);
    var result = [];
    while (count--) {
        result.push(element);
    }
    return result;
}
export function flatten(a, recurseDepth = 0) {
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
export function dispatchUnsafe(listeners, payload, trap) {
    if (listeners && listeners.length) {
        for (let i = 0, len = listeners.length; i < len; i++) {
            let fn = listeners[i];
            if (!fn)
                continue;
            try {
                fn(payload);
            }
            catch (ex) {
                if (!trap)
                    throw ex;
                else if (Type.isFunction(trap))
                    trap(ex, i);
            }
        }
    }
}
export function dispatch(listeners, payload, trap) {
    dispatchUnsafe(copy(listeners), payload, trap);
}
export function dispatchMapped(listeners, payload, trap) {
    if (!listeners)
        return null;
    var result = copy(listeners);
    if (listeners.length) {
        for (let i = 0, len = result.length; i < len; i++) {
            let fn = result[i];
            try {
                result[i] = fn
                    ? fn(payload)
                    : undefined;
            }
            catch (ex) {
                result[i] = undefined;
                if (!trap)
                    throw ex;
                else if (Type.isFunction(trap))
                    trap(ex, i);
            }
        }
    }
    return result;
}
//# sourceMappingURL=Utility.js.map