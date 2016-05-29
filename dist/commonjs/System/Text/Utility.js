/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var Types_1 = require("../Types");
exports.EMPTY = '';
var SPACE = ' ';
var ZERO = '0';
function getHashCode(source) {
    var hash = 0 | 0;
    if (source.length == 0) return hash;
    for (var i = 0, l = source.length; i < l; i++) {
        var ch = source.charCodeAt(i);
        hash = (hash << 5) - hash + ch;
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
function fromChars(chOrChars) {
    var count = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

    if (Array.isArray(chOrChars)) {
        var result = exports.EMPTY;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = chOrChars[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var char = _step.value;

                result += String.fromCharCode(char);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return result;
    } else {
        return repeat(String.fromCharCode(chOrChars), count);
    }
}
exports.fromChars = fromChars;
function escapeRegExp(source) {
    return source.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
exports.escapeRegExp = escapeRegExp;
function trim(source, chars, ignoreCase) {
    if (chars === exports.EMPTY) return source;
    if (chars) {
        var escaped = escapeRegExp(Array.isArray(chars) ? chars.join() : chars);
        return source.replace(new RegExp('^[' + escaped + ']+|[' + escaped + ']+$', 'g' + (ignoreCase ? 'i' : '')), exports.EMPTY);
    }
    return source.replace(/^\s+|\s+$/g, exports.EMPTY);
}
exports.trim = trim;
function format(source) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
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
            if (!isNaN(i)) n = i;
        }
        var r = params[n];
        switch (typeof r === "undefined" ? "undefined" : _typeof(r)) {
            case Types_1.Type.STRING:
            case Types_1.Type.NUMBER:
            case Types_1.Type.BOOLEAN:
                return r;
            default:
                return r && Types_1.Type.hasMemberOfType(r, "toString", Types_1.Type.FUNCTION) ? r.toString() : a;
        }
    });
}
exports.supplant = supplant;
function canMatch(source, match) {
    if (!Types_1.Type.isString(source) || !match) return false;
    if (source === match) return true;
    if (match.length < source.length) return null;
}
function startsWith(source, pattern) {
    var m = canMatch(source, pattern);
    return Types_1.Type.isBoolean(m) ? m : source.indexOf(pattern) == 0;
}
exports.startsWith = startsWith;
function endsWith(source, pattern) {
    var m = canMatch(source, pattern);
    return Types_1.Type.isBoolean(m) ? m : source.lastIndexOf(pattern) == source.length - pattern.length;
}
exports.endsWith = endsWith;
//# sourceMappingURL=Utility.js.map
