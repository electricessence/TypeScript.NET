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
    var ArgumentGreaterThanMaximumException = /** @class */ (function (_super) {
        tslib_1.__extends(ArgumentGreaterThanMaximumException, _super);
        function ArgumentGreaterThanMaximumException(paramName, maxValue, actualValue, message, innerException) {
            if (message === void 0) { message = "Must be no more than " + maxValue + "."; }
            var _this = this;
            // @ts-ignore
            _this.maxValue = maxValue;
            _this = _super.call(this, paramName, actualValue, message, innerException) || this;
            return _this;
        }
        ArgumentGreaterThanMaximumException.prototype.getName = function () {
            return 'ArgumentGreaterThanMaximumException';
        };
        return ArgumentGreaterThanMaximumException;
    }(ArgumentOutOfRangeException_1.default));
    exports.default = ArgumentGreaterThanMaximumException;
});
//# sourceMappingURL=ArgumentGreaterThanMaximumException.js.map