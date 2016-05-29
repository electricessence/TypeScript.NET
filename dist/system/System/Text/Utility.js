/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../Types"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1;
    var EMPTY, SPACE, ZERO;
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
    exports_1("getHashCode", getHashCode);
    function repeat(source, count) {
        var result = EMPTY;
        if (!isNaN(count)) {
            for (var i = 0; i < count; i++) {
                result += source;
            }
        }
        return result;
    }
    exports_1("repeat", repeat);
    function fromChars(chOrChars, count) {
        if (count === void 0) { count = 1; }
        if (Array.isArray(chOrChars)) {
            var result = EMPTY;
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
    exports_1("fromChars", fromChars);
    function escapeRegExp(source) {
        return source.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    exports_1("escapeRegExp", escapeRegExp);
    function trim(source, chars, ignoreCase) {
        if (chars === EMPTY)
            return source;
        if (chars) {
            var escaped = escapeRegExp(Array.isArray(chars) ? chars.join() : chars);
            return source.replace(new RegExp('^[' + escaped + ']+|[' + escaped + ']+$', 'g' + (ignoreCase
                ? 'i'
                : '')), EMPTY);
        }
        return source.replace(/^\s+|\s+$/g, EMPTY);
    }
    exports_1("trim", trim);
    function format(source) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return supplant(source, args);
    }
    exports_1("format", format);
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
    exports_1("supplant", supplant);
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
    exports_1("startsWith", startsWith);
    function endsWith(source, pattern) {
        var m = canMatch(source, pattern);
        return Types_1.Type.isBoolean(m) ? m : source.lastIndexOf(pattern) == (source.length - pattern.length);
    }
    exports_1("endsWith", endsWith);
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            }],
        execute: function() {
            exports_1("EMPTY", EMPTY = '');
            SPACE = ' ';
            ZERO = '0';
        }
    }
});
//# sourceMappingURL=Utility.js.map