/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import * as tslib_1 from "tslib";
import SystemException from "../../Exceptions/SystemException";
var UnsupportedEnumerableException = /** @class */ (function (_super) {
    tslib_1.__extends(UnsupportedEnumerableException, _super);
    function UnsupportedEnumerableException(message) {
        return _super.call(this, message || "Unsupported enumerable.") || this;
    }
    UnsupportedEnumerableException.prototype.getName = function () {
        return 'UnsupportedEnumerableException';
    };
    return UnsupportedEnumerableException;
}(SystemException));
export default UnsupportedEnumerableException;
//# sourceMappingURL=UnsupportedEnumerableException.js.map