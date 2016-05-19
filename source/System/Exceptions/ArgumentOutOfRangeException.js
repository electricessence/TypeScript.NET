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
        define(["require", "exports", "./ArgumentException"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ArgumentException_1 = require("./ArgumentException");
    var NAME = 'ArgumentOutOfRangeException';
    var ArgumentOutOfRangeException = (function (_super) {
        __extends(ArgumentOutOfRangeException, _super);
        function ArgumentOutOfRangeException(paramName, actualValue, message, innerException) {
            if (message === void 0) { message = ' '; }
            if (innerException === void 0) { innerException = null; }
            _super.call(this, paramName, +("(" + actualValue + ") ") + message, innerException, function (_) {
                _.actualValue = actualValue;
            });
        }
        ArgumentOutOfRangeException.prototype.getName = function () {
            return NAME;
        };
        return ArgumentOutOfRangeException;
    }(ArgumentException_1.ArgumentException));
    exports.ArgumentOutOfRangeException = ArgumentOutOfRangeException;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ArgumentOutOfRangeException;
});
//# sourceMappingURL=ArgumentOutOfRangeException.js.map