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
        define(["require", "exports", "../Exceptions/InvalidOperationException"], factory);
    }
})(function (require, exports) {
    "use strict";
    var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
    var NAME = 'ObjectDisposedException';
    var ObjectDisposedException = (function (_super) {
        __extends(ObjectDisposedException, _super);
        function ObjectDisposedException(objectName, message, innerException) {
            if (message === void 0) { message = null; }
            if (innerException === void 0) { innerException = null; }
            _super.call(this, message, innerException, function (_) {
                _.objectName = objectName;
            });
        }
        ObjectDisposedException.prototype.getName = function () {
            return NAME;
        };
        ObjectDisposedException.prototype.toString = function () {
            var _ = this, oName = _.objectName;
            oName = oName ? ('{' + oName + '} ') : '';
            return '[' + _.name + ': ' + oName + _.message + ']';
        };
        ObjectDisposedException.throwIfDisposed = function (disposable, objectName, message) {
            if (disposable.wasDisposed)
                throw new ObjectDisposedException(objectName, message);
        };
        return ObjectDisposedException;
    }(InvalidOperationException_1.InvalidOperationException));
    exports.ObjectDisposedException = ObjectDisposedException;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ObjectDisposedException;
});
//# sourceMappingURL=ObjectDisposedException.js.map