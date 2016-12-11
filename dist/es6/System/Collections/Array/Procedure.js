/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */ export function sum(source, ignoreNaN = false) {
    if (!source || !source.length)
        return 0;
    let result = 0;
    if (ignoreNaN) {
        for (let n of source) {
            if (!isNaN(n))
                result += n;
        }
    }
    else {
        for (let n of source) {
            if (isNaN(n))
                return NaN;
            result += n;
        }
    }
    return result;
}
export function average(source, ignoreNaN = false) {
    if (!source || !source.length)
        return NaN;
    let result = 0, count;
    if (ignoreNaN) {
        count = 0;
        for (let n of source) {
            if (!isNaN(n)) {
                result += n;
                count++;
            }
        }
    }
    else {
        count = source.length;
        for (let n of source) {
            if (isNaN(n))
                return NaN;
            result += n;
        }
    }
    return (!count || isNaN(result)) ? NaN : (result / count);
}
export function product(source, ignoreNaN = false) {
    if (!source || !source.length)
        return NaN;
    let result = 1;
    if (ignoreNaN) {
        let found = false;
        for (let n of source) {
            if (!isNaN(n)) {
                result *= n;
                found = true;
            }
        }
        if (!found)
            return NaN;
    }
    else {
        for (let n of source) {
            if (isNaN(n))
                return NaN;
            result *= n;
        }
    }
    return result;
}
/**
 * Takes the first number and divides it by all following.
 * @param source
 * @param ignoreNaN Will cause this skip any NaN values.
 * @returns {number}
 */
export function quotient(source, ignoreNaN = false) {
    const len = source ? source.length : 0;
    if (len < 2)
        return NaN;
    let result = source[0];
    let found = false;
    for (let i = 1; i < len; i++) {
        let n = source[i];
        if (n === 0) {
            return NaN;
        }
        if (isNaN(n)) {
            if (!ignoreNaN) {
                return NaN;
            }
        }
        else {
            result /= n;
            if (!found)
                found = true;
        }
    }
    return found ? result : NaN;
}
function ifSet(source, start, ignoreNaN, predicate) {
    if (!source || !source.length)
        return NaN;
    let result = start;
    if (ignoreNaN) {
        let found = false;
        for (let n of source) {
            if (!isNaN(n)) {
                if (predicate(n, result))
                    result = n;
                if (!found)
                    found = true;
            }
        }
        if (!found)
            return NaN;
    }
    else {
        for (let n of source) {
            if (isNaN(n))
                return NaN;
            if (predicate(n, result))
                result = n;
        }
    }
    return result;
}
export function min(source, ignoreNaN = false) {
    return ifSet(source, +Infinity, ignoreNaN, (n, result) => n < result);
}
export function max(source, ignoreNaN = false) {
    return ifSet(source, -Infinity, ignoreNaN, (n, result) => n > result);
}
//# sourceMappingURL=Procedure.js.map