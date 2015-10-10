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
define(["require", "exports", './ArgumentException'], function (require, exports, ArgumentException) {
    var NAME = 'ArgumentNullException';
    var ArgumentOutOfRangeException = (function (_super) {
        __extends(ArgumentOutOfRangeException, _super);
        function ArgumentOutOfRangeException(paramName, actualValue, message, innerException) {
            if (message === void 0) { message = "Out of range."; }
            if (innerException === void 0) { innerException = null; }
            this.actualValue = actualValue;
            _super.call(this, paramName, message, innerException);
        }
        ArgumentOutOfRangeException.prototype.getName = function () {
            return NAME;
        };
        return ArgumentOutOfRangeException;
    })(ArgumentException);
    return ArgumentOutOfRangeException;
});
//# sourceMappingURL=ArgumentOutOfRangeException.js.map