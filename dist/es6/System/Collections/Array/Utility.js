/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../../Types";
import { Integer } from "../../Integer";
import { areEqual } from "../../Compare";
import { ArgumentException } from "../../Exceptions/ArgumentException";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../../Exceptions/ArgumentOutOfRangeException";
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
const CBN = 'Cannot be null.', CB0 = 'Cannot be zero.', CBL0 = 'Cannot be less than zero.', VFN = 'Must be a valid finite number';
export function copyTo(source, destination, sourceIndex = 0, destinationIndex = 0, length = Infinity) {
    if (!source)
        throw new ArgumentNullException('source', CBN);
    if (!destination)
        throw new ArgumentNullException('destination', CBN);
    if (sourceIndex < 0)
        throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, CBL0);
    var sourceLength = source.length;
    if (!sourceLength)
        return destination;
    if (sourceIndex >= sourceLength)
        throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, 'Must be less than the length of the source array.');
    if (destination.length < 0)
        throw new ArgumentOutOfRangeException('destinationIndex', destinationIndex, CBL0);
    var maxLength = source.length - sourceIndex;
    if (isFinite(length) && length > maxLength)
        throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, 'Source index + length cannot exceed the length of the source array.');
    length = Math.min(length, maxLength);
    var newLength = destinationIndex + length;
    if (newLength > destination.length)
        destination.length = newLength;
    for (let i = 0; i < length; i++) {
        destination[destinationIndex + i] = source[sourceIndex + i];
    }
    return destination;
}
export function indexOf(array, item, equalityComparer = areEqual) {
    var len = array && array.length;
    if (len) {
        if (Array.isArray(array) && !Type.isTrueNaN(item))
            return array.indexOf(item);
        for (let i = 0; i < len; i++) {
            if (equalityComparer(array[i], item))
                return i;
        }
    }
    return -1;
}
export function contains(array, item, equalityComparer = areEqual) {
    return indexOf(array, item, equalityComparer) != -1;
}
export function replace(array, old, newValue, max) {
    if (!array || !array.length || max === 0)
        return 0;
    if (max < 0)
        throw new ArgumentOutOfRangeException('max', max, CBL0);
    if (!max)
        max = Infinity;
    var count = 0;
    for (let i = 0, len = array.length; i < len; i++) {
        if (array[i] === old) {
            array[i] = newValue;
            ++count;
            if (count == max)
                break;
        }
    }
    return count;
}
export function updateRange(array, value, start = 0, stop) {
    if (!array)
        return;
    Integer.assertZeroOrGreater(start, 'start');
    if (!stop && stop !== 0)
        stop = array.length;
    Integer.assert(stop, 'stop');
    if (stop < start)
        throw new ArgumentOutOfRangeException("stop", stop, "is less than start");
    for (let i = start; i < stop; i++) {
        array[i] = value;
    }
}
export function clear(array, start = 0, stop) {
    updateRange(array, null, start, stop);
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
    if (Array.isArray(array)) {
        for (let i = 0; i < len; i++) {
            if (predicate(array[i]))
                return i;
        }
    }
    else {
        for (let i = 0; i < len; i++) {
            if ((i) in (array) && predicate(array[i]))
                return i;
        }
    }
    return -1;
}
export function forEach(source, action) {
    if (source && action) {
        for (let i = 0; i < source.length; i++) {
            if (action(source[i], i) === false)
                break;
        }
    }
}
export function applyTo(target, fn) {
    if (target && fn) {
        for (let i = 0; i < target.length; i++) {
            target[i] = fn(target[i]);
        }
    }
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
    if (!array || !array.length || max === 0)
        return 0;
    if (max < 0)
        throw new ArgumentOutOfRangeException('max', max, CBL0);
    var count = 0;
    if (!max || !isFinite(max)) {
        for (let i = (array.length - 1); i >= 0; i--) {
            if (equalityComparer(array[i], value)) {
                array.splice(i, 1);
                ++count;
            }
        }
    }
    else {
        var found = [];
        for (let i = 0, len = array.length; i < len; i++) {
            if (equalityComparer(array[i], value)) {
                found.push(i);
                ++count;
                if (count == max)
                    break;
            }
        }
        for (let i = found.length - 1; i >= 0; i--) {
            array.splice(found[i], 1);
        }
    }
    return count;
}
export function repeat(element, count) {
    Integer.assert(count, 'count');
    if (count < 0)
        throw new ArgumentOutOfRangeException('count', count, CBL0);
    var result = initialize(count);
    for (let i = 0; i < count; i++) {
        result[i] = element;
    }
    return result;
}
export function range(first, count, step = 1) {
    if (isNaN(first) || !isFinite(first))
        throw new ArgumentOutOfRangeException('first', first, VFN);
    if (isNaN(count) || !isFinite(count))
        throw new ArgumentOutOfRangeException('count', count, VFN);
    if (count < 0)
        throw new ArgumentOutOfRangeException('count', count, CBL0);
    var result = initialize(count);
    for (let i = 0; i < count; i++) {
        result[i] = first;
        first += step;
    }
    return result;
}
export function rangeUntil(first, until, step = 1) {
    if (step == 0)
        throw new ArgumentOutOfRangeException('step', step, CB0);
    return range(first, (until - first) / step, step);
}
export function distinct(source) {
    var seen = {};
    return source.filter(e => !(e in seen) && (seen[e] = true));
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
//# sourceMappingURL=Utility.js.map