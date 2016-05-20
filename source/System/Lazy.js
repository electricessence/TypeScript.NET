/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Disposable/DisposableBase", "./Exceptions/ArgumentNullException"], factory);
    }
})(function (require, exports) {
    "use strict";
    var DisposableBase_1 = require("./Disposable/DisposableBase");
    var ArgumentNullException_1 = require("./Exceptions/ArgumentNullException");
    var Lazy = (function (_super) {
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
    exports.Lazy = Lazy;
    var ResettableLazy = (function (_super) {
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
    exports.ResettableLazy = ResettableLazy;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Lazy;
});
//# sourceMappingURL=Lazy.js.map