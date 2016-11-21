/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
"use strict";
var SystemException_1 = require("./SystemException");
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var NAME = 'NullReferenceException';
var NullReferenceException = (function (_super) {
    __extends(NullReferenceException, _super);
    function NullReferenceException() {
        return _super.apply(this, arguments) || this;
    }
    NullReferenceException.prototype.getName = function () {
        return NAME;
    };
    return NullReferenceException;
}(SystemException_1.SystemException));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NullReferenceException;
//# sourceMappingURL=NullReferenceException.js.map