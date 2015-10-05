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
        for (var i = 0; i < args.length; i++) {
            source = source.replace("{" + i + "}", args[i]);
        }
        return source;
    }
    exports.format = format;
    function supplant(source, o) {
        return source.replace(/\{([^{}]*)\}/g, function (a, b) {
            var r = o[b];
            switch (typeof r) {
                case Types.STRING:
                    return true;
                case Types.NUMBER:
                    return r;
                default:
                    return a;
            }
        });
    }
    exports.supplant = supplant;
});
//# sourceMappingURL=Utility.js.map