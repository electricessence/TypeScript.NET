/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./ArgumentException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ArgumentException_1 = require("./ArgumentException");
    var ArgumentOutOfRangeException = /** @class */ (function (_super) {
        tslib_1.__extends(ArgumentOutOfRangeException, _super);
        function ArgumentOutOfRangeException(paramName, actualValue, message, innerException) {
            if (message === void 0) { message = ' '; }
            return _super.call(this, paramName, "(" + actualValue + ") " + message, innerException, function (_) {
                _.actualValue = actualValue;
            }) || this;
        }
        ArgumentOutOfRangeException.prototype.getName = function () {
            return 'ArgumentOutOfRangeException';
        };
        return ArgumentOutOfRangeException;
    }(ArgumentException_1.default));
    exports.default = ArgumentOutOfRangeException;
});
//# sourceMappingURL=ArgumentOutOfRangeException.js.map