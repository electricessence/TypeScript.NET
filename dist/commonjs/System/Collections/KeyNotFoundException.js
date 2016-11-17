/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.collections.generic.KeyNotFoundException(v=vs.110).aspx
 */
"use strict";
var SystemException_1 = require("../Exceptions/SystemException");
var extends_1 = require("../../extends");
var __extends = extends_1.default;
var NAME = 'KeyNotFoundException ';
var KeyNotFoundException = (function (_super) {
    __extends(KeyNotFoundException, _super);
    function KeyNotFoundException() {
        return _super.apply(this, arguments) || this;
    }
    KeyNotFoundException.prototype.getName = function () {
        return NAME;
    };
    return KeyNotFoundException;
}(SystemException_1.SystemException));
exports.KeyNotFoundException = KeyNotFoundException;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KeyNotFoundException;
//# sourceMappingURL=KeyNotFoundException.js.map