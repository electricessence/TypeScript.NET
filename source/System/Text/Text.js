/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports"], function (require, exports) {
    var Text;
    (function (Text) {
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
        Text.format = format;
    })(Text || (Text = {}));
    return Text;
});
//# sourceMappingURL=Text.js.map