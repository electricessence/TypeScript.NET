/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../Exceptions/SystemException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var SystemException_1 = require("../../Exceptions/SystemException");
    var UnsupportedEnumerableException = /** @class */ (function (_super) {
        tslib_1.__extends(UnsupportedEnumerableException, _super);
        function UnsupportedEnumerableException(message) {
            return _super.call(this, message || "Unsupported enumerable.") || this;
        }
        UnsupportedEnumerableException.prototype.getName = function () {
            return 'UnsupportedEnumerableException';
        };
        return UnsupportedEnumerableException;
    }(SystemException_1.default));
    exports.default = UnsupportedEnumerableException;
});
//# sourceMappingURL=UnsupportedEnumerableException.js.map