import { Type } from "../Types";
export const EMPTY = '';
export function getHashCode(source) {
    let hash = 0 | 0;
    if (source.length == 0)
        return hash;
    for (let i = 0, l = source.length; i < l; i++) {
        let ch = source.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash |= 0;
    }
    return hash;
}
export function repeat(source, count) {
    let result = EMPTY;
    if (!isNaN(count)) {
        for (let i = 0; i < count; i++) {
            result += source;
        }
    }
    return result;
}
export function fromChars(chOrChars, count = 1) {
    if (Array.isArray(chOrChars)) {
        let result = EMPTY;
        for (let char of chOrChars) {
            result += String.fromCharCode(char);
        }
        return result;
    }
    else {
        return repeat(String.fromCharCode(chOrChars), count);
    }
}
export function escapeRegExp(source) {
    return source.replace(/[-[\]\/{}()*+?.\\^$|]/g, "\\$&");
}
export function trim(source, chars, ignoreCase) {
    if (chars === EMPTY)
        return source;
    if (chars) {
        const escaped = escapeRegExp(Array.isArray(chars) ? chars.join() : chars);
        return source.replace(new RegExp('^[' + escaped + ']+|[' + escaped + ']+$', 'g' + (ignoreCase
            ? 'i'
            : '')), EMPTY);
    }
    return source.replace(/^\s+|\s+$/g, EMPTY);
}
export function format(source, ...args) {
    return supplant(source, args);
}
export function supplant(source, params) {
    const oIsArray = Array.isArray(params);
    return source.replace(/\{([^{}]*)}/g, (a, b) => {
        let n = b;
        if (oIsArray) {
            let i = parseInt(b);
            if (!isNaN(i))
                n = i;
        }
        let r = params[n];
        switch (typeof r) {
            case Type.STRING:
            case Type.NUMBER:
            case Type.BOOLEAN:
                return r;
            default:
                return (r && Type.hasMemberOfType(r, "toString", Type.FUNCTION))
                    ? r.toString()
                    : a;
        }
    });
}
function canMatch(source, match) {
    if (!Type.isString(source) || !match)
        return false;
    if (source === match)
        return true;
    if (match.length < source.length)
        return null;
}
export function startsWith(source, pattern) {
    const m = canMatch(source, pattern);
    return Type.isBoolean(m) ? m : source.indexOf(pattern) == 0;
}
export function endsWith(source, pattern) {
    const m = canMatch(source, pattern);
    return Type.isBoolean(m) ? m : source.lastIndexOf(pattern) == (source.length - pattern.length);
}
//# sourceMappingURL=Utility.js.map