(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "../Exceptions/InvalidOperationException", "../../extends"], function (require, exports) {
    "use strict";
    var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
    var extends_1 = require("../../extends");
    var __extends = extends_1.default;
    var NAME = 'ObjectDisposedException';
    var ObjectDisposedException = (function (_super) {
        __extends(ObjectDisposedException, _super);
        function ObjectDisposedException(objectName, message, innerException) {
            return _super.call(this, message || '', innerException, function (_) {
                _.objectName = objectName;
            }) || this;
        }
        ObjectDisposedException.prototype.getName = function () {
            return NAME;
        };
        ObjectDisposedException.prototype.toString = function () {
            var _ = this;
            var oName = _.objectName;
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