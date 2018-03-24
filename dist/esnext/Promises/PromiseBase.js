/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import * as tslib_1 from "tslib";
import { deferImmediate } from "../Threading/deferImmediate";
import { defer } from "../Threading/defer";
import PromiseState, { PromiseStateValue } from "./PromiseState";
export function handleDispatch(p, onFulfilled, onRejected) {
    if (p instanceof PromiseBase) {
        p.doneNow(onFulfilled, onRejected);
    }
    else {
        p.then(onFulfilled, onRejected);
    }
}
export function handleResolutionMethods(targetFulfill, targetReject, value, resolver) {
    try {
        var v = resolver ? resolver(value) : value;
        if (targetFulfill)
            targetFulfill(v);
    }
    catch (ex) {
        if (targetReject)
            targetReject(ex);
    }
}
var PromiseBase = /** @class */ (function (_super) {
    tslib_1.__extends(PromiseBase, _super);
    //readonly [Symbol.toStringTag]: "Promise";
    function PromiseBase() {
        var _this = _super.call(this, PromiseStateValue.Pending) || this;
        _this._disposableObjectName = "PromiseState";
        return _this;
    }
    /**
     * Same as 'thenSynchronous' but does not return the result.  Returns the current promise instead.
     * You may not need an additional promise result, and this will not create a new one.
     * @param onFulfilled
     * @param onRejected
     */
    PromiseBase.prototype.thenThis = function (onFulfilled, onRejected) {
        this.doneNow(onFulfilled, onRejected);
        return this;
    };
    /**
     * Standard .then method that defers execution until resolved.
     * @param onFulfilled
     * @param onRejected
     * @returns {Promise}
     */
    PromiseBase.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        this.throwIfDisposed();
        return this.create(function (resolve, reject) {
            _this.doneNow(function (result) {
                return handleResolutionMethods(resolve, reject, result, onFulfilled);
            }, function (error) {
                return onRejected
                    ? handleResolutionMethods(resolve, reject, error, onRejected)
                    : reject(error);
            });
        });
    };
    /**
     * Same as .then but doesn't trap errors.  Exceptions may end up being fatal.
     * @param onFulfilled
     * @param onRejected
     * @returns {Promise}
     */
    PromiseBase.prototype.thenAllowFatal = function (onFulfilled, onRejected) {
        var _this = this;
        this.throwIfDisposed();
        return this.create(function (resolve, reject) {
            _this.doneNow(function (result) {
                return resolve((onFulfilled ? onFulfilled(result) : result));
            }, function (error) {
                return reject(onRejected ? onRejected(error) : error);
            });
        });
    };
    /**
     * .done is provided as a non-standard means that maps to similar functionality in other promise libraries.
     * As stated by promisejs.org: 'then' is to 'done' as 'map' is to 'forEach'.
     * @param onFulfilled
     * @param onRejected
     */
    PromiseBase.prototype.done = function (onFulfilled, onRejected) {
        var _this = this;
        defer(function () { return _this.doneNow(onFulfilled, onRejected); });
    };
    /**
     * Will yield for a number of milliseconds from the time called before continuing.
     * @param milliseconds
     * @returns A promise that yields to the current execution and executes after a delay.
     */
    PromiseBase.prototype.delayFromNow = function (milliseconds) {
        var _this = this;
        if (milliseconds === void 0) { milliseconds = 0; }
        this.throwIfDisposed();
        return this.create(function (resolve, reject) {
            defer(function () {
                _this.doneNow(function (v) { return resolve(v); }, function (e) { return reject(e); });
            }, milliseconds);
        }, true // Since the resolve/reject is deferred.
        );
    };
    /**
     * Will yield for a number of milliseconds from after this promise resolves.
     * If the promise is already resolved, the delay will start from now.
     * @param milliseconds
     * @returns A promise that yields to the current execution and executes after a delay.
     */
    PromiseBase.prototype.delayAfterResolve = function (milliseconds) {
        var _this = this;
        if (milliseconds === void 0) { milliseconds = 0; }
        this.throwIfDisposed();
        if (this.isSettled)
            return this.delayFromNow(milliseconds);
        return this.create(function (resolve, reject) {
            _this.doneNow(function (v) { return defer(function () { return resolve(v); }, milliseconds); }, function (e) { return defer(function () { return reject(e); }, milliseconds); });
        }, true // Since the resolve/reject is deferred.
        );
    };
    /**
     * Shortcut for trapping a rejection.
     * @param onRejected
     * @returns {PromiseBase<TResult>}
     */
    PromiseBase.prototype['catch'] = function (onRejected) {
        return this.then(null, onRejected);
    };
    /**
     * Shortcut for trapping a rejection but will allow exceptions to propagate within the onRejected handler.
     * @param onRejected
     * @returns {PromiseBase<TResult>}
     */
    PromiseBase.prototype.catchAllowFatal = function (onRejected) {
        return this.thenAllowFatal(null, onRejected);
    };
    /**
     * Shortcut to for handling either resolve or reject.
     * @param fin
     * @returns {PromiseBase<TResult>}
     */
    PromiseBase.prototype['finally'] = function (fin) {
        return this.then(fin, fin);
    };
    /**
     * Shortcut to for handling either resolve or reject but will allow exceptions to propagate within the handler.
     * @param fin
     * @returns {PromiseBase<TResult>}
     */
    PromiseBase.prototype.finallyAllowFatal = function (fin) {
        return this.thenAllowFatal(fin, fin);
    };
    /**
     * Shortcut to for handling either resolve or reject.  Returns the current promise instead.
     * You may not need an additional promise result, and this will not create a new one.
     * @param fin
     * @param synchronous
     * @returns {PromiseBase}
     */
    PromiseBase.prototype.finallyThis = function (fin, synchronous) {
        var f = synchronous ? fin : function () { return deferImmediate(fin); };
        this.doneNow(f, f);
        return this;
    };
    return PromiseBase;
}(PromiseState));
export default PromiseBase;
//# sourceMappingURL=PromiseBase.js.map