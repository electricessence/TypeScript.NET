/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export function sum(source, ignoreNaN = false) {
    if (!source || !source.length)
        return 0;
    var result = 0;
    if (ignoreNaN)
        source.forEach(n => {
            if (!isNaN(n))
                result += n;
        });
    else
        source.every(n => {
            result += n;
            return !isNaN(result);
        });
    return result;
}
export function average(source, ignoreNaN = false) {
    if (!source || !source.length)
        return NaN;
    var result = 0, count;
    if (ignoreNaN) {
        count = 0;
        source.forEach(n => {
            if (!isNaN(n)) {
                result += n;
                count++;
            }
        });
    }
    else {
        count = source.length;
        source.every(n => {
            result += n;
            return !isNaN(result);
        });
    }
    return (!count || isNaN(result)) ? NaN : (result / count);
}
export function product(source, ignoreNaN = false) {
    if (!source || !source.length)
        return NaN;
    var result = 1;
    if (ignoreNaN) {
        var found = false;
        source.forEach(n => {
            if (!isNaN(n)) {
                result *= n;
                if (!found)
                    found = true;
            }
        });
        if (!found)
            result = NaN;
    }
    else {
        source.every(n => {
            if (isNaN(n)) {
                result = NaN;
                return false;
            }
            result *= n;
            return true;
        });
    }
    return result;
}
export function quotient(source, ignoreNaN = false) {
    if (!source || source.length < 2)
        return NaN;
    var result = source[0];
    var found = false;
    source.every((n, i) => {
        if (i) {
            if (n === 0) {
                result = NaN;
                return false;
            }
            if (isNaN(n)) {
                if (!ignoreNaN) {
                    result = NaN;
                    return false;
                }
            }
            else {
                result /= n;
                if (!found)
                    found = true;
            }
        }
        return true;
    });
    if (!found)
        result = NaN;
    return result;
}
function ifSet(source, start, ignoreNaN, predicate) {
    if (!source || !source.length)
        return NaN;
    var result = start;
    if (ignoreNaN) {
        var found = false;
        source.forEach(n => {
            if (!isNaN(n)) {
                if (predicate(n, result))
                    result = n;
                if (!found)
                    found = true;
            }
        });
        if (!found)
            result = NaN;
    }
    else {
        source.every(n => {
            if (isNaN(n)) {
                result = NaN;
                return false;
            }
            if (predicate(n, result))
                result = n;
            return true;
        });
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