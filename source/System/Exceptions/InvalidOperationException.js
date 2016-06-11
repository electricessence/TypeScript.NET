/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./SystemException", "../../extends"], factory);
    }
})(function (require, exports) {
    "use strict";
    var SystemException_1 = require("./SystemException");
    var extends_1 = require("../../extends");
    var __extends = extends_1.default;
    var NAME = 'InvalidOperationException';
    var InvalidOperationException = (function (_super) {
        __extends(InvalidOperationException, _super);
        function InvalidOperationException() {
            _super.apply(this, arguments);
        }
        InvalidOperationException.prototype.getName = function () {
            return NAME;
        };
        return InvalidOperationException;
    }(SystemException_1.SystemException));
    exports.InvalidOperationException = InvalidOperationException;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InvalidOperationException;
});
//# sourceMappingURL=InvalidOperationException.js.map