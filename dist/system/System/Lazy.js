/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./Disposable/DisposableBase", "./Exceptions/ArgumentNullException"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var DisposableBase_1, ArgumentNullException_1;
    var Lazy, ResettableLazy;
    return {
        setters:[
            function (DisposableBase_1_1) {
                DisposableBase_1 = DisposableBase_1_1;
            },
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            }],
        execute: function() {
            Lazy = (function (_super) {
                __extends(Lazy, _super);
                function Lazy(_closure) {
                    _super.call(this);
                    this._closure = _closure;
                    if (!_closure)
                        throw new ArgumentNullException_1.ArgumentNullException("_closure");
                    this._disposableObjectName = 'Lazy';
                }
                Object.defineProperty(Lazy.prototype, "isValueCreated", {
                    get: function () {
                        return this._isValueCreated;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Lazy.prototype, "value", {
                    get: function () {
                        return this.getValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Lazy.prototype, "error", {
                    get: function () {
                        return this._error;
                    },
                    enumerable: true,
                    configurable: true
                });
                Lazy.prototype.getValue = function () {
                    var _ = this;
                    _.throwIfDisposed();
                    try {
                        if (!_._isValueCreated && _._closure) {
                            var v = _._closure();
                            _._value = v;
                            _._error = void 0;
                            return v;
                        }
                    }
                    catch (ex) {
                        _._error = ex;
                        throw ex;
                    }
                    finally {
                        _._onValueRequested();
                        _._isValueCreated = true;
                    }
                    return _._value;
                };
                Lazy.prototype._onValueRequested = function () {
                    this._closure = null;
                };
                Lazy.prototype._onDispose = function () {
                    this._closure = null;
                    this._value = null;
                };
                Lazy.prototype.equals = function (other) {
                    return this == other;
                };
                Lazy.prototype.valueEquals = function (other) {
                    return this.equals(other) || this.value === other.value;
                };
                return Lazy;
            }(DisposableBase_1.DisposableBase));
            exports_1("Lazy", Lazy);
            ResettableLazy = (function (_super) {
                __extends(ResettableLazy, _super);
                function ResettableLazy() {
                    _super.apply(this, arguments);
                }
                ResettableLazy.prototype.getValue = function (clearClosureReference) {
                    var v = _super.prototype.getValue.call(this);
                    if (clearClosureReference)
                        _super.prototype._onValueRequested.call(this);
                    return v;
                };
                ResettableLazy.prototype._onValueRequested = function () {
                };
                Object.defineProperty(ResettableLazy.prototype, "canReset", {
                    get: function () {
                        return !this.wasDisposed && !!(this._closure);
                    },
                    enumerable: true,
                    configurable: true
                });
                ResettableLazy.prototype.reset = function (throwIfCannotReset) {
                    var _ = this;
                    if (throwIfCannotReset)
                        _.throwIfDisposed();
                    if (!_._closure) {
                        if (throwIfCannotReset)
                            throw new Error("Cannot reset.  This Lazy has already de-referenced its closure.");
                        return false;
                    }
                    else {
                        _._isValueCreated = false;
                        _._value = null;
                        _._error = void 0;
                        return true;
                    }
                };
                return ResettableLazy;
            }(Lazy));
            exports_1("ResettableLazy", ResettableLazy);
            exports_1("default",Lazy);
        }
    }
});
//# sourceMappingURL=Lazy.js.map