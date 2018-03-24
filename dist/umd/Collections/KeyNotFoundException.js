/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.collections.generic.KeyNotFoundException(v=vs.110).aspx
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../Exceptions/SystemException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var SystemException_1 = require("../Exceptions/SystemException");
    var KeyNotFoundException = /** @class */ (function (_super) {
        tslib_1.__extends(KeyNotFoundException, _super);
        function KeyNotFoundException() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        KeyNotFoundException.prototype.getName = function () {
            return 'KeyNotFoundException';
        };
        return KeyNotFoundException;
    }(SystemException_1.default));
    exports.default = KeyNotFoundException;
});
//# sourceMappingURL=KeyNotFoundException.js.map