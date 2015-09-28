/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.systemexception%28v=vs.110%29.aspx
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Exception'], function (require, exports, Exception) {
    var NAME = 'SystemException';
    var SystemException = (function (_super) {
        __extends(SystemException, _super);
        function SystemException() {
            _super.apply(this, arguments);
        }
        SystemException.prototype.getName = function () {
            return NAME;
        };
        return SystemException;
    })(Exception);
    return SystemException;
});
//# sourceMappingURL=SystemException.js.map