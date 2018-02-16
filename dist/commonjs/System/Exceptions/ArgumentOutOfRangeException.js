"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ArgumentException_1 = require("./ArgumentException");
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var NAME = 'ArgumentOutOfRangeException';
var ArgumentOutOfRangeException = /** @class */ (function (_super) {
    __extends(ArgumentOutOfRangeException, _super);
    function ArgumentOutOfRangeException(paramName, actualValue, message, innerException) {
        if (message === void 0) { message = ' '; }
        return _super.call(this, paramName, "(" + actualValue + ") " + message, innerException, function (_) {
            _.actualValue = actualValue;
        }) || this;
    }
    ArgumentOutOfRangeException.prototype.getName = function () {
        return NAME;
    };
    return ArgumentOutOfRangeException;
}(ArgumentException_1.ArgumentException));
exports.ArgumentOutOfRangeException = ArgumentOutOfRangeException;
exports.default = ArgumentOutOfRangeException;
//# sourceMappingURL=ArgumentOutOfRangeException.js.map