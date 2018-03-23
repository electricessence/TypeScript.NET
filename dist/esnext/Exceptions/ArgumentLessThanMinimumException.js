/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import ArgumentOutOfRangeException from "./ArgumentOutOfRangeException";
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
}(ArgumentOutOfRangeException));
export default ArgumentLessThanMinimumException;
//# sourceMappingURL=ArgumentLessThanMinimumException.js.map