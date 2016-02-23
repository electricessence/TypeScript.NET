/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './ObjectDisposedException'], factory);
    }
})(function (require, exports) {
    'use strict';
    var ObjectDisposedException_1 = require('./ObjectDisposedException');
    var DisposableBase = (function () {
        function DisposableBase(_finalizer) {
            this._finalizer = _finalizer;
            this._wasDisposed = false;
        }
        Object.defineProperty(DisposableBase.prototype, "wasDisposed", {
            get: function () {
                return this._wasDisposed;
            },
            enumerable: true,
            configurable: true
        });
        DisposableBase.prototype.throwIfDisposed = function (message, objectName) {
            if (objectName === void 0) { objectName = this._disposableObjectName; }
            if (this._wasDisposed)
                throw new ObjectDisposedException_1.default(objectName, message);
            return true;
        };
        DisposableBase.prototype.dispose = function () {
            var _ = this;
            if (!_._wasDisposed) {
                _._wasDisposed = true;
                try {
                    _._onDispose();
                }
                finally {
                    if (_._finalizer)
                        _._finalizer();
                }
            }
        };
        DisposableBase.prototype._onDispose = function () { };
        return DisposableBase;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DisposableBase;
});
//# sourceMappingURL=DisposableBase.js.map