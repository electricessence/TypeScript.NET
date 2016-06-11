/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.systemexception%28v=vs.110%29.aspx
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Exception", "../../extends"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Exception_1 = require("../Exception");
    var extends_1 = require("../../extends");
    var __extends = extends_1.default;
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
    }(Exception_1.Exception));
    exports.SystemException = SystemException;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SystemException;
});
//# sourceMappingURL=SystemException.js.map