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
define(["require", "exports", './SystemException', '../Text/Utility'], function (require, exports, SystemException_1, Utility_1) {
    var NAME = 'ArgumentException';
    var ArgumentException = (function (_super) {
        __extends(ArgumentException, _super);
        function ArgumentException(paramName, message, innerException) {
            if (message === void 0) { message = null; }
            if (innerException === void 0) { innerException = null; }
            var _ = this, pn = _.paramName;
            pn = pn ? ('{' + pn + '} ') : '';
            _.paramName = paramName;
            _super.call(this, Utility_1.trim(pn + message), innerException);
        }
        ArgumentException.prototype.getName = function () {
            return NAME;
        };
        ArgumentException.prototype.toString = function () {
            var _ = this;
            return '[' + _.name + ': ' + _.message + ']';
        };
        return ArgumentException;
    })(SystemException_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ArgumentException;
});
//# sourceMappingURL=ArgumentException.js.map