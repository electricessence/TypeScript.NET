/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../Exceptions/InvalidOperationException'], function (require, exports, InvalidOperationException) {
    var NAME = 'ObjectDisposedException';
    var ObjectDisposedException = (function (_super) {
        __extends(ObjectDisposedException, _super);
        function ObjectDisposedException(objectName, message, innerException) {
            if (message === void 0) { message = null; }
            if (innerException === void 0) { innerException = null; }
            this.objectName = objectName;
            _super.call(this, message, innerException);
        }
        ObjectDisposedException.prototype.getName = function () {
            return NAME;
        };
        ObjectDisposedException.prototype.toString = function () {
            var _ = this, oName = _.objectName;
            oName = oName ? ('{' + oName + '} ') : '';
            return '[' + _.name + ': ' + oName + _.message + ']';
        };
        return ObjectDisposedException;
    })(InvalidOperationException);
    return ObjectDisposedException;
});
//# sourceMappingURL=ObjectDisposedException.js.map