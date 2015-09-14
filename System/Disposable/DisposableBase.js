/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
///<reference path="IDisposableAware.ts"/>
'use strict';
define(["require", "exports"], function (require, exports) {
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
        // This allows for the use of a boolean instead of calling this.assertIsNotDisposed() since there is a strong chance of introducing a circular reference.
        DisposableBase.assertIsNotDisposed = function (disposed, errorMessage) {
            if (errorMessage === void 0) { errorMessage = "ObjectDisposedException"; }
            if (disposed)
                throw new Error(errorMessage);
            return true;
        };
        DisposableBase.prototype.assertIsNotDisposed = function (errorMessage) {
            if (errorMessage === void 0) { errorMessage = "ObjectDisposedException"; }
            return DisposableBase.assertIsNotDisposed(this._wasDisposed, errorMessage);
        };
        DisposableBase.prototype.dispose = function () {
            var _ = this;
            if (!_._wasDisposed) {
                // Preemptively set wasDisposed in order to prevent repeated disposing.
                // NOTE: in true multi-threaded scenarios, this needs to be synchronized.
                _._wasDisposed = true;
                try {
                    _._onDispose(); // Protected override.
                }
                finally {
                    if (_._finalizer)
                        _._finalizer();
                }
            }
        };
        // Override this to handle destruction...
        // Be sure to call super._onDestroy() in deeper sub classes...
        DisposableBase.prototype._onDispose = function () {
        };
        return DisposableBase;
    })();
    return DisposableBase;
});
//# sourceMappingURL=DisposableBase.js.map