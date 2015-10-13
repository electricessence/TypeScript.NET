/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports", '../Types'], function (require, exports, Types) {
    function format(source) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return supplant(source, args);
    }
    exports.format = format;
    function supplant(source, params) {
        var oIsArray = params instanceof Array;
        return source.replace(/\{([^{}]*)\}/g, function (a, b) {
            var n = b;
            if (oIsArray) {
                var i = parseInt(b);
                if (!isNaN(i))
                    n = i;
            }
            var r = params[n];
            switch (typeof r) {
                case Types.STRING:
                case Types.NUMBER:
                case Types.BOOLEAN:
                    return r;
                default:
                    return a;
            }
        });
    }
    exports.supplant = supplant;
});
//# sourceMappingURL=Utility.js.map