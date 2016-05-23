/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./ObjectDisposedException"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ObjectDisposedException_1;
    var DisposableBase;
    return {
        setters:[
            function (ObjectDisposedException_1_1) {
                ObjectDisposedException_1 = ObjectDisposedException_1_1;
            }],
        execute: function() {
            DisposableBase = (function () {
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
            exports_1("DisposableBase", DisposableBase);
            exports_1("default",DisposableBase);
        }
    }
});
//# sourceMappingURL=DisposableBase.js.map