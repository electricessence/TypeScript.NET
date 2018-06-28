"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectDisposedException_1 = require("./ObjectDisposedException");
var DisposableBase = /** @class */ (function () {
    function DisposableBase(_disposableObjectName, __finalizer) {
        this._disposableObjectName = _disposableObjectName;
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
            // Preemptively set wasDisposed in order to prevent repeated disposing.
            // NOTE: in true multi-threaded scenarios, this needs to be synchronized.
            _.__wasDisposed = true;
            try {
                _._onDispose(); // Protected override.
            }
            finally {
                if (_.__finalizer) // Private finalizer...
                 {
                    _.__finalizer();
                    _.__finalizer = void 0;
                }
            }
        }
    };
    // Placeholder for overrides.
    DisposableBase.prototype._onDispose = function () { };
    return DisposableBase;
}());
exports.DisposableBase = DisposableBase;
exports.default = DisposableBase;
//# sourceMappingURL=DisposableBase.js.map