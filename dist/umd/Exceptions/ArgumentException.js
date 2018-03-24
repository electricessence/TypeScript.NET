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
        define(["require", "exports", "tslib", "./SystemException", "../Text/trim"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var SystemException_1 = require("./SystemException");
    var trim_1 = require("../Text/trim");
    var ArgumentException = /** @class */ (function (_super) {
        tslib_1.__extends(ArgumentException, _super);
        // For simplicity and consistency, lets stick with 1 signature.
        function ArgumentException(paramName, message, innerException, beforeSealing) {
            var _this = this;
            var pn = paramName ? ('{' + paramName + '} ') : '';
            _this = _super.call(this, trim_1.default(pn + (message || '')), innerException, function (_) {
                _.paramName = paramName;
                if (beforeSealing)
                    beforeSealing(_);
            }) || this;
            return _this;
        }
        ArgumentException.prototype.getName = function () {
            return 'ArgumentException';
        };
        return ArgumentException;
    }(SystemException_1.default));
    exports.default = ArgumentException;
});
//# sourceMappingURL=ArgumentException.js.map