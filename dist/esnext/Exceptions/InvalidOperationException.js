/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import * as tslib_1 from "tslib";
import SystemException from "./SystemException";
var InvalidOperationException = /** @class */ (function (_super) {
    tslib_1.__extends(InvalidOperationException, _super);
    function InvalidOperationException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InvalidOperationException.prototype.getName = function () {
        return 'InvalidOperationException';
    };
    return InvalidOperationException;
}(SystemException));
export default InvalidOperationException;
//# sourceMappingURL=InvalidOperationException.js.map