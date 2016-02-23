/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['./ObjectDisposedException'], function(exports_1, context_1) {
    'use strict';
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
            exports_1("default",DisposableBase);
        }
    }
});
//# sourceMappingURL=DisposableBase.js.map