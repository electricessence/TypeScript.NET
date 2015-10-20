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
})(["require", "exports", './Types', './Exceptions/ArgumentException'], function (require, exports) {
    var Types_1 = require('./Types');
    var ArgumentException_1 = require('./Exceptions/ArgumentException');
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