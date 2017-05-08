"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../Types");
exports.EMPTY = '';
/**
 * Returns a numerical (integer) hash code of the string.  Can be used for identifying inequality of contents, but two different strings in rare cases will have the same hash code.
 * @param source
 * @returns {number}
 */
function getHashCode(source) {
    var hash = 0 | 0;
    if (source.length == 0)
        return hash;
    for (var i = 0, l = source.length; i < l; i++) {
        var ch = source.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
exports.getHashCode = getHashCode;
function repeat(source, count) {
    var result = exports.EMPTY;
    if (!isNaN(count)) {
        for (var i = 0; i < count; i++) {
            result += source;
        }
    }
    return result;
}
exports.repeat = repeat;
function fromChars(chOrChars, count) {
    if (count === void 0) { count = 1; }
    if ((chOrChars) instanceof (Array)) {
        var result = exports.EMPTY;
        for (var _i = 0, chOrChars_1 = chOrChars; _i < chOrChars_1.length; _i++) {
            var char = chOrChars_1[_i];
            result += String.fromCharCode(char);
        }
        return result;
    }
    else {
        return repeat(String.fromCharCode(chOrChars), count);
    }
}
exports.fromChars = fromChars;
/**
 * Escapes a RegExp sequence.
 * @param source
 * @returns {string}
 */
function escapeRegExp(source) {
    return source.replace(/[-[\]\/{}()*+?.\\^$|]/g, "\\$&");
}
exports.escapeRegExp = escapeRegExp;
/**
 * Can trim any character or set of characters from the ends of a string.
 * Uses a Regex escapement to replace them with empty.
 * @param source
 * @param chars A string or array of characters desired to be trimmed.
 * @param ignoreCase
 * @returns {string}
 */
function trim(source, chars, ignoreCase) {
    if (chars === exports.EMPTY)
        return source;
    if (chars) {
        var escaped = escapeRegExp((chars) instanceof (Array) ? chars.join() : chars);
        return source.replace(new RegExp('^[' + escaped + ']+|[' + escaped + ']+$', 'g' + (ignoreCase
            ? 'i'
            : '')), exports.EMPTY);
    }
    return source.replace(/^\s+|\s+$/g, exports.EMPTY);
}
exports.trim = trim;
/**
 * Takes any arg
 * @param source
 * @param args
 * @returns {string}
 */
function format(source) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return supplant(source, args);
}
exports.format = format;
//
/**
 * This takes a string and replaces '{string}' with the respected parameter.
 * Also allows for passing an array in order to use '{n}' notation.
 * Not limited to an array's indexes.  For example, {length} is allowed.
 * Based upon Crockford's supplant function.
 * @param source
 * @param params
 * @returns {string}
 */
function supplant(source, params) {
    var oIsArray = (params) instanceof (Array);
    return source.replace(/{([^{}]*)}/g, function (a, b) {
        var n = b;
        if (oIsArray) {
            var i = parseInt(b);
            if (!isNaN(i))
                n = i;
        }
        var r = params[n];
        switch (typeof r) {
            case Types_1.Type.STRING:
            case Types_1.Type.NUMBER:
            case Types_1.Type.BOOLEAN:
                return r;
            default:
                return (r && Types_1.Type.hasMemberOfType(r, "toString", Types_1.Type.FUNCTION))
                    ? r.toString()
                    : a;
        }
    });
}
exports.supplant = supplant;
function canMatch(source, match) {
    if (!Types_1.Type.isString(source) || !match)
        return false;
    if (source === match)
        return true;
    if (match.length < source.length)
        return null;
}
/**
 * Returns true if the pattern matches the beginning of the source.
 * @param source
 * @param pattern
 * @returns {boolean}
 */
function startsWith(source, pattern) {
    var m = canMatch(source, pattern);
    return Types_1.Type.isBoolean(m) ? m : source.indexOf(pattern) == 0;
}
exports.startsWith = startsWith;
/**
 * Returns true if the pattern matches the end of the source.
 * @param source
 * @param pattern
 * @returns {boolean}
 */
function endsWith(source, pattern) {
    var m = canMatch(source, pattern);
    return Types_1.Type.isBoolean(m) ? m : source.lastIndexOf(pattern) == (source.length - pattern.length);
}
exports.endsWith = endsWith;
//# sourceMappingURL=Utility.js.map