/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.systemexception%28v=vs.110%29.aspx
 */
import * as tslib_1 from "tslib";
import Exception from "../Exception";
var SystemException = /** @class */ (function (_super) {
    tslib_1.__extends(SystemException, _super);
    function SystemException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /*
        constructor(
            message:string = null,
            innerException:Error = null,
            beforeSealing?:(ex:any)=>void)
        {
            super(message, innerException, beforeSealing);
        }
    */
    SystemException.prototype.getName = function () {
        return 'SystemException';
    };
    return SystemException;
}(Exception));
export default SystemException;
//# sourceMappingURL=SystemException.js.map