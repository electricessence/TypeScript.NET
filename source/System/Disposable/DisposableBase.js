/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./ObjectDisposedException"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ObjectDisposedException_1 = require("./ObjectDisposedException");
    var DisposableBase = (function () {
        function DisposableBase(__finalizer) {
            this.__finalizer = __finalizer;
            this.__wasDisposed = false;
        }
        Object.defineProperty(DisposableBase.prototype, "wasDisposed", {
            get: function () {
                return this.__wasDisposed;
            },
            enumerable: true,
            configurable: true
        });
        DisposableBase.prototype.throwIfDisposed = function (message, objectName) {
            if (objectName === void 0) { objectName = this._disposableObjectName; }
            if (this.__wasDisposed)
                throw new ObjectDisposedException_1.ObjectDisposedException(objectName, message);
            return true;
        };
        DisposableBase.prototype.dispose = function () {
            var _ = this;
            if (!_.__wasDisposed) {
                _.__wasDisposed = true;
                try {
                    _._onDispose();
                }
                finally {
                    if (_.__finalizer) {
                        _.__finalizer();
                        _.__finalizer = void 0;
                    }
                }
            }
        };
        DisposableBase.prototype._onDispose = function () { };
        return DisposableBase;
    }());
    exports.DisposableBase = DisposableBase;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DisposableBase;
});
//# sourceMappingURL=DisposableBase.js.map