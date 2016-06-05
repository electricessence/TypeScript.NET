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
var extends_1 = require("../../extends");
var __extends = extends_1.default;
var NAME = 'NotImplementedException';
var NotImplementedException = (function (_super) {
    __extends(NotImplementedException, _super);
    function NotImplementedException() {
        _super.apply(this, arguments);
    }
    NotImplementedException.prototype.getName = function () {
        return NAME;
    };
    return NotImplementedException;
}(SystemException_1.SystemException));
exports.NotImplementedException = NotImplementedException;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotImplementedException;
//# sourceMappingURL=NotImplementedException.js.map