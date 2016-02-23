/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['../Types'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1;
    var EMPTY;
    function escapeRegExp(source) {
        return source.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    exports_1("escapeRegExp", escapeRegExp);
    function trim(source, chars, ignoreCase) {
        if (chars) {
            if (chars === EMPTY)
                return source;
            var escaped = escapeRegExp(Array.isArray(chars) ? chars.join() : chars);
            return source.replace(new RegExp('^[' + escaped + ']+|[' + escaped + ']+$', 'g' + (ignoreCase ? 'i' : '')), EMPTY);
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
                case Types_1.default.STRING:
                case Types_1.default.NUMBER:
                case Types_1.default.BOOLEAN:
                    return r;
                default:
                    return a;
            }
        });
    }
    exports_1("supplant", supplant);
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            }],
        execute: function() {
            exports_1("EMPTY", EMPTY = '');
        }
    }
});
//# sourceMappingURL=Utility.js.map