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
        define(["require", "exports", "tslib", "../Exceptions/ArgumentException", "./Promise", "../Exceptions/ArgumentNullException", "./Functions/isPromise", "./PromiseState", "./PromiseBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ArgumentException_1 = require("../Exceptions/ArgumentException");
    var Promise_1 = require("./Promise");
    var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
    var isPromise_1 = require("./Functions/isPromise");
    var PromiseState_1 = require("./PromiseState");
    var PromiseBase_1 = require("./PromiseBase");
    var TARGET = "target";
    /**
     * Provided as a means for extending the interface of other PromiseLike<T> objects.
     */
    var PromiseWrapper = /** @class */ (function (_super) {
        tslib_1.__extends(PromiseWrapper, _super);
        function PromiseWrapper(_target) {
            var _this = _super.call(this) || this;
            _this._target = _target;
            if (!_target)
                throw new ArgumentNullException_1.default(TARGET);
            if (!isPromise_1.default(_target))
                throw new ArgumentException_1.default(TARGET, "Must be a promise-like object.");
            _target.then(function (v) {
                _this._state = PromiseState_1.PromiseStateValue.Fulfilled;
                _this._result = v;
                _this._error = null;
                _this._target = null;
            }, function (e) {
                _this._state = PromiseState_1.PromiseStateValue.Rejected;
                _this._error = e;
                _this._target = null;
            });
            return _this;
        }
        PromiseWrapper.prototype.thenSynchronous = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            var t = this._target;
            if (!t)
                return _super.prototype.thenSynchronous.call(this, onFulfilled, onRejected);
            return new Promise_1.default(function (resolve, reject) {
                PromiseBase_1.handleDispatch(t, function (result) { return PromiseBase_1.handleResolutionMethods(resolve, reject, result, onFulfilled); }, function (error) { return onRejected
                    ? PromiseBase_1.handleResolutionMethods(resolve, null, error, onRejected)
                    : reject(error); });
            }, true);
        };
        PromiseWrapper.prototype.doneNow = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            var t = this._target;
            if (t)
                PromiseBase_1.handleDispatch(t, onFulfilled, onRejected);
            else
                _super.prototype.doneNow.call(this, onFulfilled, onRejected);
        };
        PromiseWrapper.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this._target = null;
        };
        return PromiseWrapper;
    }(Promise_1.Resolvable));
    exports.default = PromiseWrapper;
});
//# sourceMappingURL=PromiseWrapper.js.map