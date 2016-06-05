/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./Disposable/DisposableBase", "./Exceptions/ArgumentNullException", "../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var DisposableBase_1, ArgumentNullException_1, extends_1;
    var __extends, ResolverBase;
    return {
        setters:[
            function (DisposableBase_1_1) {
                DisposableBase_1 = DisposableBase_1_1;
            },
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            ResolverBase = (function (_super) {
                __extends(ResolverBase, _super);
                function ResolverBase(_valueFactory, _trapExceptions, _allowReset) {
                    _super.call(this);
                    this._valueFactory = _valueFactory;
                    this._trapExceptions = _trapExceptions;
                    this._allowReset = _allowReset;
                    if (!_valueFactory)
                        throw new ArgumentNullException_1.ArgumentNullException("valueFactory");
                    this._isValueCreated = false;
                }
                ResolverBase.prototype.getError = function () {
                    return this._error;
                };
                Object.defineProperty(ResolverBase.prototype, "error", {
                    get: function () {
                        return this.getError();
                    },
                    enumerable: true,
                    configurable: true
                });
                ResolverBase.prototype.getValue = function () {
                    var _ = this;
                    _.throwIfDisposed();
                    if (_._isValueCreated === null)
                        throw new Error("Recursion detected.");
                    if (!_._isValueCreated && _._valueFactory) {
                        _._isValueCreated = null;
                        try {
                            var c = void 0;
                            if (!_._isValueCreated && (c = _._valueFactory)) {
                                _._isValueCreated = null;
                                if (!this._allowReset)
                                    this._valueFactory = null;
                                var v = c();
                                _._value = v;
                                _._error = void 0;
                                return v;
                            }
                        }
                        catch (ex) {
                            _._error = ex;
                            if (!_._trapExceptions)
                                throw ex;
                        }
                        finally {
                            _._isValueCreated = true;
                        }
                    }
                    return _._value;
                };
                Object.defineProperty(ResolverBase.prototype, "canReset", {
                    get: function () {
                        return this._allowReset && !!this._valueFactory;
                    },
                    enumerable: true,
                    configurable: true
                });
                ResolverBase.prototype._onDispose = function () {
                    this._valueFactory = null;
                    this._value = null;
                    this._isValueCreated = null;
                };
                ResolverBase.prototype.tryReset = function () {
                    var _ = this;
                    if (!_._valueFactory)
                        return false;
                    else {
                        _._isValueCreated = false;
                        _._value = null;
                        _._error = void 0;
                        return true;
                    }
                };
                return ResolverBase;
            }(DisposableBase_1.DisposableBase));
            exports_1("ResolverBase", ResolverBase);
            exports_1("default",ResolverBase);
        }
    }
});
//# sourceMappingURL=ResolverBase.js.map