"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
Object.defineProperty(exports, "__esModule", { value: true });
var SystemException_1 = require("./SystemException");
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var NAME = 'InvalidOperationException';
var InvalidOperationException = /** @class */ (function (_super) {
    __extends(InvalidOperationException, _super);
    function InvalidOperationException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InvalidOperationException.prototype.getName = function () {
        return NAME;
    };
    return InvalidOperationException;
}(SystemException_1.SystemException));
exports.InvalidOperationException = InvalidOperationException;
exports.default = InvalidOperationException;
//# sourceMappingURL=InvalidOperationException.js.map