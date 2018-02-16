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
var NAME = 'NotImplementedException';
var NotImplementedException = /** @class */ (function (_super) {
    __extends(NotImplementedException, _super);
    function NotImplementedException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotImplementedException.prototype.getName = function () {
        return NAME;
    };
    return NotImplementedException;
}(SystemException_1.SystemException));
exports.NotImplementedException = NotImplementedException;
exports.default = NotImplementedException;
//# sourceMappingURL=NotImplementedException.js.map