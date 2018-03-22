/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import * as tslib_1 from "tslib";
import ArgumentException from "./ArgumentException";
var NAME = 'ArgumentNullException';
var ArgumentNullException = /** @class */ (function (_super) {
    tslib_1.__extends(ArgumentNullException, _super);
    function ArgumentNullException(paramName, message, innerException) {
        if (message === void 0) { message = "'" + paramName + "' is null (or undefined)."; }
        return _super.call(this, paramName, message, innerException) || this;
    }
    ArgumentNullException.prototype.getName = function () {
        return NAME;
    };
    return ArgumentNullException;
}(ArgumentException));
export default ArgumentNullException;
//# sourceMappingURL=ArgumentNullException.js.map