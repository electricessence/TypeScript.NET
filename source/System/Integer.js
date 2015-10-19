/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports", './Types', './Exceptions/ArgumentException'], function (require, exports, Types_1, ArgumentException_1) {
    function Integer(n) {
        return n | 0;
    }
    var Integer;
    (function (Integer) {
        function random(max) {
            return (Math.random() * max) | 0;
        }
        Integer.random = random;
        function is(n) {
            return Types_1.default.isNumber(n, false) && n == (n | 0);
        }
        Integer.is = is;
        function assert(n, argumentName) {
            var i = is(n);
            if (!i) {
                throw new ArgumentException_1.default(argumentName || 'n', "Must be an integer.");
            }
            return i;
        }
        Integer.assert = assert;
    })(Integer || (Integer = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Integer;
});
//# sourceMappingURL=Integer.js.map