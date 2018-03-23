/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import * as tslib_1 from "tslib";
import InvalidOperationException from "../Exceptions/InvalidOperationException";
var ObjectDisposedException = /** @class */ (function (_super) {
    tslib_1.__extends(ObjectDisposedException, _super);
    // For simplicity and consistency, lets stick with 1 signature.
    function ObjectDisposedException(objectName, message, innerException) {
        return _super.call(this, message || '', innerException, function (_) {
            _.objectName = objectName;
        }) || this;
    }
    // noinspection JSMethodCanBeStatic
    ObjectDisposedException.prototype.getName = function () {
        return 'ObjectDisposedException';
    };
    ObjectDisposedException.prototype.toString = function () {
        var _ = this;
        var oName = _.objectName;
        oName = oName ? ('{' + oName + '} ') : '';
        return '[' + _.name + ': ' + oName + _.message + ']';
    };
    ObjectDisposedException.throwIfDisposed = function (disposable, objectName, message) {
        if (disposable.wasDisposed)
            throw new ObjectDisposedException(objectName, message);
        return true;
    };
    return ObjectDisposedException;
}(InvalidOperationException));
export default ObjectDisposedException;
//# sourceMappingURL=ObjectDisposedException.js.map