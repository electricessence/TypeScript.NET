/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./ArgumentOutOfRangeException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ArgumentOutOfRangeException_1 = require("./ArgumentOutOfRangeException");
    var ArgumentLessThanMinimumException = /** @class */ (function (_super) {
        tslib_1.__extends(ArgumentLessThanMinimumException, _super);
        function ArgumentLessThanMinimumException(paramName, minValue, actualValue, message, innerException) {
            if (message === void 0) { message = "Must be at least " + minValue + "."; }
            var _this = this;
            // @ts-ignore
            _this.minValue = minValue;
            _this = _super.call(this, paramName, actualValue, message, innerException) || this;
            return _this;
        }
        ArgumentLessThanMinimumException.prototype.getName = function () {
            return 'ArgumentLessThanMinimumException';
        };
        return ArgumentLessThanMinimumException;
    }(ArgumentOutOfRangeException_1.default));
    exports.default = ArgumentLessThanMinimumException;
});
//# sourceMappingURL=ArgumentLessThanMinimumException.js.map