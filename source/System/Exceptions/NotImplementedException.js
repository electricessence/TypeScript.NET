/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './SystemException'], function (require, exports, SystemException) {
    var NAME = 'NotImplementedException';
    var NotImplementedException = (function (_super) {
        __extends(NotImplementedException, _super);
        function NotImplementedException() {
            _super.apply(this, arguments);
        }
        NotImplementedException.prototype.getName = function () {
            return NAME;
        };
        return NotImplementedException;
    })(SystemException);
    return NotImplementedException;
});
//# sourceMappingURL=NotImplementedException.js.map