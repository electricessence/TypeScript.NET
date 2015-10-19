/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.escapeRegExp = escapeRegExp;
exports.trim = trim;
exports.format = format;
exports.supplant = supplant;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Types = require('../Types');

var _Types2 = _interopRequireDefault(_Types);

var EMPTY = '';
exports.EMPTY = EMPTY;

function escapeRegExp(source) {
    return source.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function trim(source, chars, ignoreCase) {
    if (chars) {
        if (chars === EMPTY) return source;
        var escaped = escapeRegExp(chars instanceof Array ? chars.join() : chars);
        return source.replace(new RegExp('^[' + escaped + ']+|[' + escaped + ']+$', 'g' + (ignoreCase ? 'i' : '')), EMPTY);
    }
    return source.replace(/^\s+|\s+$/g, EMPTY);
}

function format(source) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return supplant(source, args);
}

function supplant(source, params) {
    var oIsArray = params instanceof Array;
    return source.replace(/\{([^{}]*)\}/g, function (a, b) {
        var n = b;
        if (oIsArray) {
            var i = parseInt(b);
            if (!isNaN(i)) n = i;
        }
        var r = params[n];
        switch (typeof r) {
            case _Types2['default'].STRING:
            case _Types2['default'].NUMBER:
            case _Types2['default'].BOOLEAN:
                return r;
            default:
                return a;
        }
    });
}
//# sourceMappingURL=Utility.js.map
