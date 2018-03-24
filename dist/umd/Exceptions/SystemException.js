/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.systemexception%28v=vs.110%29.aspx
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./Exception"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Exception_1 = require("./Exception");
    var SystemException = /** @class */ (function (_super) {
        tslib_1.__extends(SystemException, _super);
        function SystemException() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /*
            constructor(
                message:string = null,
                innerException:Error = null,
                beforeSealing?:(ex:any)=>void)
            {
                super(message, innerException, beforeSealing);
            }
        */
        SystemException.prototype.getName = function () {
            return 'SystemException';
        };
        return SystemException;
    }(Exception_1.default));
    exports.default = SystemException;
});
//# sourceMappingURL=SystemException.js.map