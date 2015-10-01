/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
///<reference path="IDisposableAware.d.ts"/>
'use strict';
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
    DisposableBase.prototype._onDispose = function () {
    };
    return DisposableBase;
})();
module.exports = DisposableBase;
