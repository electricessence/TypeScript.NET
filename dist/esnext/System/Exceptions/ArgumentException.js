/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import * as tslib_1 from "tslib";
import SystemException from "./SystemException";
import { trim } from "../Text/Utility";
var ArgumentException = /** @class */ (function (_super) {
    tslib_1.__extends(ArgumentException, _super);
    // For simplicity and consistency, lets stick with 1 signature.
    function ArgumentException(paramName, message, innerException, beforeSealing) {
        var _this = this;
        var pn = paramName ? ('{' + paramName + '} ') : '';
        _this = _super.call(this, trim(pn + (message || '')), innerException, function (_) {
            _.paramName = paramName;
            if (beforeSealing)
                beforeSealing(_);
        }) || this;
        return _this;
    }
    ArgumentException.prototype.getName = function () {
        return 'ArgumentException';
    };
    return ArgumentException;
}(SystemException));
export default ArgumentException;
//# sourceMappingURL=ArgumentException.js.map