/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import * as tslib_1 from "tslib";
import SystemException from "./SystemException";
var NAME = 'NotImplementedException';
var NotImplementedException = /** @class */ (function (_super) {
    tslib_1.__extends(NotImplementedException, _super);
    function NotImplementedException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotImplementedException.prototype.getName = function () {
        return NAME;
    };
    return NotImplementedException;
}(SystemException));
export { NotImplementedException };
export default NotImplementedException;
//# sourceMappingURL=NotImplementedException.js.map