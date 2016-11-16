/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports"], function (require, exports) {
    "use strict";
    exports.Error = 'Error';
    exports.EvalError = 'EvalError';
    exports.RangeError = 'RangeError';
    exports.ReferenceError = 'ReferenceError';
    exports.SyntaxError = 'SyntaxError';
    exports.TypeError = 'TypeError';
    exports.URIError = 'URIError';
});
//# sourceMappingURL=ExceptionType.js.map