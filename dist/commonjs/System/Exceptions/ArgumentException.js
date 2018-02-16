"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
Object.defineProperty(exports, "__esModule", { value: true });
var SystemException_1 = require("./SystemException");
var Utility_1 = require("../Text/Utility");
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var NAME = 'ArgumentException';
var ArgumentException = /** @class */ (function (_super) {
    __extends(ArgumentException, _super);
    // For simplicity and consistency, lets stick with 1 signature.
    function ArgumentException(paramName, message, innerException, beforeSealing) {
        var _this = this;
        var pn = paramName ? ('{' + paramName + '} ') : '';
        _this = _super.call(this, Utility_1.trim(pn + (message || '')), innerException, function (_) {
            _.paramName = paramName;
            if (beforeSealing)
                beforeSealing(_);
        }) || this;
        return _this;
    }
    ArgumentException.prototype.getName = function () {
        return NAME;
    };
    return ArgumentException;
}(SystemException_1.SystemException));
exports.ArgumentException = ArgumentException;
exports.default = ArgumentException;
//# sourceMappingURL=ArgumentException.js.map