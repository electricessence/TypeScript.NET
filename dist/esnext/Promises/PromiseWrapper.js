/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import * as tslib_1 from "tslib";
import ArgumentException from "../Exceptions/ArgumentException";
import Promise, { Resolvable } from "./Promise";
import ArgumentNullException from "../Exceptions/ArgumentNullException";
import isPromise from "./Functions/isPromise";
import { PromiseStateValue } from "./PromiseState";
import { handleDispatch, handleResolutionMethods } from "./PromiseBase";
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
            throw new ArgumentNullException(TARGET);
        if (!isPromise(_target))
            throw new ArgumentException(TARGET, "Must be a promise-like object.");
        _target.then(function (v) {
            _this._state = PromiseStateValue.Fulfilled;
            _this._result = v;
            _this._error = null;
            _this._target = null;
        }, function (e) {
            _this._state = PromiseStateValue.Rejected;
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
        return new Promise(function (resolve, reject) {
            handleDispatch(t, function (result) { return handleResolutionMethods(resolve, reject, result, onFulfilled); }, function (error) { return onRejected
                ? handleResolutionMethods(resolve, null, error, onRejected)
                : reject(error); });
        }, true);
    };
    PromiseWrapper.prototype.doneNow = function (onFulfilled, onRejected) {
        this.throwIfDisposed();
        var t = this._target;
        if (t)
            handleDispatch(t, onFulfilled, onRejected);
        else
            _super.prototype.doneNow.call(this, onFulfilled, onRejected);
    };
    PromiseWrapper.prototype._onDispose = function () {
        _super.prototype._onDispose.call(this);
        this._target = null;
    };
    return PromiseWrapper;
}(Resolvable));
export default PromiseWrapper;
//# sourceMappingURL=PromiseWrapper.js.map