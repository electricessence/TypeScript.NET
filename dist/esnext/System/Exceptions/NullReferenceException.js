/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import * as tslib_1 from "tslib";
import { SystemException } from "./SystemException";
var NAME = 'NullReferenceException';
var NullReferenceException = /** @class */ (function (_super) {
    tslib_1.__extends(NullReferenceException, _super);
    function NullReferenceException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NullReferenceException.prototype.getName = function () {
        return NAME;
    };
    return NullReferenceException;
}(SystemException));
export default NullReferenceException;
//# sourceMappingURL=NullReferenceException.js.map