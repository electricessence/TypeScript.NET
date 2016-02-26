/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var Types_1 = require('../Types');
exports.EMPTY = '';
function escapeRegExp(source) {
    return source.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
exports.escapeRegExp = escapeRegExp;
function trim(source, chars, ignoreCase) {
    if (chars) {
        if (chars === exports.EMPTY) return source;
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
        switch (typeof r === 'undefined' ? 'undefined' : _typeof(r)) {
            case Types_1.default.STRING:
            case Types_1.default.NUMBER:
            case Types_1.default.BOOLEAN:
                return r;
            default:
                return a;
        }
    });
}
exports.supplant = supplant;
//# sourceMappingURL=Utility.js.map
