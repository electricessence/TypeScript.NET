/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports", '../Types'], function (require, exports, Types) {
    var Utility;
    (function (Utility) {
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
        Utility.format = format;
        function supplant(source, o) {
            return source.replace(/\{([^{}]*)\}/g, function (a, b) {
                var r = o[b];
                switch (typeof r) {
                    case Types.String:
                        return true;
                    case Types.Number:
                        return r;
                    default:
                        return a;
                }
            });
        }
        Utility.supplant = supplant;
    })(Utility || (Utility = {}));
    return Utility;
});
//# sourceMappingURL=Utility.js.map