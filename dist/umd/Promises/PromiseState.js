/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../Disposable/DisposableBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var DisposableBase_1 = require("../Disposable/DisposableBase");
    var PromiseState = /** @class */ (function (_super) {
        tslib_1.__extends(PromiseState, _super);
        function PromiseState(_state, _result, _error) {
            var _this = _super.call(this, "PromiseState") || this;
            _this._state = _state;
            _this._result = _result;
            _this._error = _error;
            return _this;
        }
        PromiseState.prototype._onDispose = function () {
            this._state = null;
            this._result = null;
            this._error = null;
        };
        PromiseState.prototype.getState = function () {
            return this._state;
        };
        Object.defineProperty(PromiseState.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PromiseState.prototype, "isPending", {
            get: function () {
                return this.getState() === PromiseStateValue.Pending;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PromiseState.prototype, "isSettled", {
            get: function () {
                return this.getState() != PromiseStateValue.Pending; // Will also include undefined==0 aka disposed!=resolved.
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PromiseState.prototype, "isFulfilled", {
            get: function () {
                return this.getState() === PromiseStateValue.Fulfilled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PromiseState.prototype, "isRejected", {
            get: function () {
                return this.getState() === PromiseStateValue.Rejected;
            },
            enumerable: true,
            configurable: true
        });
        /*
         * Providing overrides allows for special defer or lazy sub classes.
         */
        PromiseState.prototype.getResult = function () {
            return this._result;
        };
        Object.defineProperty(PromiseState.prototype, "result", {
            get: function () {
                this.throwIfDisposed();
                return this.getResult();
            },
            enumerable: true,
            configurable: true
        });
        PromiseState.prototype.getError = function () {
            return this._error;
        };
        Object.defineProperty(PromiseState.prototype, "error", {
            get: function () {
                this.throwIfDisposed();
                return this.getError();
            },
            enumerable: true,
            configurable: true
        });
        return PromiseState;
    }(DisposableBase_1.default));
    exports.default = PromiseState;
    /**
     * The state of a promise.
     * https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md
     * If a promise is disposed the value will be undefined which will also evaluate (promise.state)==false.
     */
    var PromiseStateValue;
    (function (PromiseStateValue) {
        PromiseStateValue[PromiseStateValue["Pending"] = 0] = "Pending";
        PromiseStateValue[PromiseStateValue["Fulfilled"] = 1] = "Fulfilled";
        PromiseStateValue[PromiseStateValue["Rejected"] = -1] = "Rejected";
    })(PromiseStateValue = exports.PromiseStateValue || (exports.PromiseStateValue = {}));
    Object.freeze(PromiseStateValue);
});
//# sourceMappingURL=PromiseState.js.map