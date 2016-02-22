/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../Types'], function (require, exports) {
    var Types_1 = require('../Types');
    exports.EMPTY = '';
    function escapeRegExp(source) {
        return source.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
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
        if (chars) {
            if (chars === exports.EMPTY)
                return source;
            var escaped = escapeRegExp(Array.isArray(chars) ? chars.join() : chars);
            return source.replace(new RegExp('^[' + escaped + ']+|[' + escaped + ']+$', 'g' + (ignoreCase ? 'i' : '')), exports.EMPTY);
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
});
//# sourceMappingURL=Utility.js.map