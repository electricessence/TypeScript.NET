/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import * as tslib_1 from "tslib";
import { ArgumentException } from "./ArgumentException";
var NAME = 'ArgumentOutOfRangeException';
var ArgumentOutOfRangeException = /** @class */ (function (_super) {
    tslib_1.__extends(ArgumentOutOfRangeException, _super);
    function ArgumentOutOfRangeException(paramName, actualValue, message, innerException) {
        if (message === void 0) { message = ' '; }
        return _super.call(this, paramName, "(" + actualValue + ") " + message, innerException, function (_) {
            _.actualValue = actualValue;
        }) || this;
    }
    ArgumentOutOfRangeException.prototype.getName = function () {
        return NAME;
    };
    return ArgumentOutOfRangeException;
}(ArgumentException));
export default ArgumentOutOfRangeException;
//# sourceMappingURL=ArgumentOutOfRangeException.js.map