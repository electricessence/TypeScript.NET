/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../Exceptions/SystemException"], factory);
    }
})(function (require, exports) {
    "use strict";
    var SystemException_1 = require("../../Exceptions/SystemException");
    var NAME = 'UnsupportedEnumerableException';
    var UnsupportedEnumerableException = (function (_super) {
        __extends(UnsupportedEnumerableException, _super);
        function UnsupportedEnumerableException(message) {
            _super.call(this, message || "Unsupported enumerable.");
        }
        UnsupportedEnumerableException.prototype.getName = function () {
            return NAME;
        };
        return UnsupportedEnumerableException;
    }(SystemException_1.SystemException));
    exports.UnsupportedEnumerableException = UnsupportedEnumerableException;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UnsupportedEnumerableException;
});
//# sourceMappingURL=UnsupportedEnumerableException.js.map