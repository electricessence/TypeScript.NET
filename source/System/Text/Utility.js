/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Types"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    exports.EMPTY = '';
    var SPACE = ' ';
    var ZERO = '0';
    function getHashCode(source) {
        var hash = 0 | 0;
        if (source.length == 0)
            return hash;
        for (var i = 0, l = source.length; i < l; i++) {
            var ch = source.charCodeAt(i);
            hash = ((hash << 5) - hash) + ch;
            hash |= 0;
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
        if (Array.isArray(chOrChars)) {
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
    function escapeRegExp(source) {
        return source.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    exports.escapeRegExp = escapeRegExp;
    function trim(source, chars, ignoreCase) {
        if (chars === exports.EMPTY)
            return source;
        if (chars) {
            var escaped = escapeRegExp(Array.isArray(chars) ? chars.join() : chars);
            return source.replace(new RegExp('^[' + escaped + ']+|[' + escaped + ']+$', 'g' + (ignoreCase
                ? 'i'
                : '')), exports.EMPTY);
        }
        return source.replace(/^\s+|\s+$/g, exports.EMPTY);
    }
    exports.trim = trim;
    function format(source) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return supplant(source, args);
    }
    exports.format = format;
    function supplant(source, params) {
        var oIsArray = Array.isArray(params);
        return source.replace(/\{([^{}]*)\}/g, function (a, b) {
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
    function startsWith(source, pattern) {
        var m = canMatch(source, pattern);
        return Types_1.Type.isBoolean(m) ? m : source.indexOf(pattern) == 0;
    }
    exports.startsWith = startsWith;
    function endsWith(source, pattern) {
        var m = canMatch(source, pattern);
        return Types_1.Type.isBoolean(m) ? m : source.lastIndexOf(pattern) == (source.length - pattern.length);
    }
    exports.endsWith = endsWith;
});
//# sourceMappingURL=Utility.js.map