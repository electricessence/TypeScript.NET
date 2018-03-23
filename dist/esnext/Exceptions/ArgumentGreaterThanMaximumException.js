/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import ArgumentOutOfRangeException from "./ArgumentOutOfRangeException";
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
}(ArgumentOutOfRangeException));
export default ArgumentGreaterThanMaximumException;
//# sourceMappingURL=ArgumentGreaterThanMaximumException.js.map