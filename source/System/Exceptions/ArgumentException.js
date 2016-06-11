/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SystemException_1 = require("./SystemException");
var Utility_1 = require("../Text/Utility");
var extends_1 = require("../../extends");
var __extends = extends_1.default;
var NAME = 'ArgumentException';
var ArgumentException = (function (_super) {
    __extends(ArgumentException, _super);
    function ArgumentException(paramName, message, innerException, beforeSealing) {
        if (message === void 0) { message = null; }
        if (innerException === void 0) { innerException = null; }
        var pn = paramName ? ('{' + paramName + '} ') : '';
        _super.call(this, Utility_1.trim(pn + (message || '')), innerException, function (_) {
            _.paramName = paramName;
            if (beforeSealing)
                beforeSealing(_);
        });
    }
    ArgumentException.prototype.getName = function () {
        return NAME;
    };
    return ArgumentException;
}(SystemException_1.SystemException));
exports.ArgumentException = ArgumentException;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArgumentException;
//# sourceMappingURL=ArgumentException.js.map