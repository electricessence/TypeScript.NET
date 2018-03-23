/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.collections.generic.KeyNotFoundException(v=vs.110).aspx
 */
import * as tslib_1 from "tslib";
import SystemException from "../Exceptions/SystemException";
var KeyNotFoundException = /** @class */ (function (_super) {
    tslib_1.__extends(KeyNotFoundException, _super);
    function KeyNotFoundException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyNotFoundException.prototype.getName = function () {
        return 'KeyNotFoundException';
    };
    return KeyNotFoundException;
}(SystemException));
export default KeyNotFoundException;
//# sourceMappingURL=KeyNotFoundException.js.map