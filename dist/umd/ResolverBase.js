/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./Disposable/DisposableBase", "./Exceptions/ArgumentNullException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var DisposableBase_1 = require("./Disposable/DisposableBase");
    var ArgumentNullException_1 = require("./Exceptions/ArgumentNullException");
    var NAME = "ResolverBase";
    /**
     * The ResolverBase class handles resolving a factory method and detects recursion.
     * Since JS does not have a synchronization mechanism (lock or otherwise)
     * we have to prevent getValue from double triggering the value factory (optimistic concurrency)
     * or returning return a value that is intermediate between resolving and resolved.
     */
    var ResolverBase = /** @class */ (function (_super) {
        tslib_1.__extends(ResolverBase, _super);
        function ResolverBase(_valueFactory, _trapExceptions, _allowReset) {
            if (_allowReset === void 0) { _allowReset = false; }
            var _this = _super.call(this, NAME) || this;
            _this._valueFactory = _valueFactory;
            _this._trapExceptions = _trapExceptions;
            _this._allowReset = _allowReset;
            if (!_valueFactory)
                throw new ArgumentNullException_1.default("valueFactory");
            _this._isValueCreated = false;
            return _this;
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
                _._isValueCreated = null; // Mark this as 'resolving'.
                try {
                    var c = void 0;
                    if (!_._isValueCreated && (c = _._valueFactory)) {
                        _._isValueCreated = null; // Mark this as 'resolving'.
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
    }(DisposableBase_1.default));
    exports.default = ResolverBase;
});
//# sourceMappingURL=ResolverBase.js.map