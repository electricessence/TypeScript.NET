/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * See Readme.md for details.
 */
import * as tslib_1 from "tslib";
import { deferImmediate } from "../Threading/deferImmediate";
import InvalidOperationException from "../Exceptions/InvalidOperationException";
import ArgumentNullException from "../Exceptions/ArgumentNullException";
import ObjectPool from "../Disposable/ObjectPool";
import ObjectDisposedException from "../Disposable/ObjectDisposedException";
import PromiseBase from "./PromiseBase";
import isPromise from "./Functions/isPromise";
import wrap from "./Functions/wrap";
import resolve from "./Functions/resolve";
import { PromiseStateValue } from "./PromiseState";
var VOID0 = void 0, NULL = null, PROMISE = "Promise", PROMISE_STATE = PROMISE + "PromiseStateValue", THEN = "then", TARGET = "target";
function resolveInternal(value, resolver, promiseFactory) {
    var nextValue = resolver
        ? resolver(value)
        : value;
    return nextValue && isPromise(nextValue)
        ? wrap(nextValue)
        : promiseFactory(nextValue);
}
function handleResolution(p, value, resolver) {
    try {
        var v = resolver ? resolver(value) : value;
        if (p) { //noinspection JSIgnoredPromiseFromCall
            p.resolve(v);
        }
        return null;
    }
    catch (ex) {
        if (p) { //noinspection JSIgnoredPromiseFromCall
            p.reject(ex);
        }
        return ex;
    }
}
export function handleSyncIfPossible(p, onFulfilled, onRejected) {
    if (p instanceof PromiseBase)
        return p.thenSynchronous(onFulfilled, onRejected);
    else
        return p.then(onFulfilled, onRejected);
}
function newODE() {
    return new ObjectDisposedException("Promise", "An underlying promise-result was disposed.");
}
var Resolvable = /** @class */ (function (_super) {
    tslib_1.__extends(Resolvable, _super);
    function Resolvable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Resolvable.prototype.doneNow = function (onFulfilled, onRejected) {
        this.throwIfDisposed();
        switch (this.state) {
            case PromiseStateValue.Fulfilled:
                if (onFulfilled)
                    onFulfilled(this._result);
                break;
            case PromiseStateValue.Rejected:
                if (onRejected)
                    onRejected(this._error);
                break;
        }
    };
    Resolvable.prototype.thenSynchronous = function (onFulfilled, onRejected) {
        this.throwIfDisposed();
        try {
            switch (this.state) {
                case PromiseStateValue.Fulfilled:
                    return onFulfilled
                        ? resolveInternal(this._result, onFulfilled, resolve)
                        : this; // Provided for catch cases.
                case PromiseStateValue.Rejected:
                    return onRejected
                        ? resolveInternal(this._error, onRejected, resolve)
                        : this;
            }
        }
        catch (ex) {
            return new Rejected(ex);
        }
        throw new Error("Invalid state for a resolved promise.");
    };
    Resolvable.prototype.create = function (resolver, forceSynchronous) {
        if (forceSynchronous === void 0) { forceSynchronous = false; }
        return new Promise(resolver, forceSynchronous);
    };
    return Resolvable;
}(PromiseBase));
export { Resolvable };
/**
 * The simplest usable version of a promise which returns synchronously the resolved state provided.
 */
var Resolved = /** @class */ (function (_super) {
    tslib_1.__extends(Resolved, _super);
    function Resolved(state, result, error) {
        var _this = _super.call(this) || this;
        _this._result = result;
        _this._error = error;
        _this._state = state;
        return _this;
    }
    return Resolved;
}(Resolvable));
export { Resolved };
/**
 * A fulfilled Resolved<T>.  Provided for readability.
 */
var Fulfilled = /** @class */ (function (_super) {
    tslib_1.__extends(Fulfilled, _super);
    function Fulfilled(value) {
        return _super.call(this, PromiseStateValue.Fulfilled, value) || this;
    }
    return Fulfilled;
}(Resolved));
export { Fulfilled };
/**
 * A rejected Resolved<T>.  Provided for readability.
 */
var Rejected = /** @class */ (function (_super) {
    tslib_1.__extends(Rejected, _super);
    function Rejected(error) {
        return _super.call(this, PromiseStateValue.Rejected, void (0), error) || this;
    }
    return Rejected;
}(Resolved));
export { Rejected };
/**
 * This promise class that facilitates pending resolution.
 */
var Promise = /** @class */ (function (_super) {
    tslib_1.__extends(Promise, _super);
    /*
     * A note about deferring:
     * The caller can set resolveImmediate to true if they intend to initialize code that will end up being deferred itself.
     * This eliminates the extra defer that will occur internally.
     * But for the most part, resolveImmediate = false (the default) will ensure the constructor will not block.
     *
     * resolveUsing allows for the same ability but does not defer by default: allowing the caller to take on the work load.
     * If calling resolve or reject and a deferred response is desired, then use deferImmediate with a closure to do so.
     */
    function Promise(resolver, forceSynchronous) {
        if (forceSynchronous === void 0) { forceSynchronous = false; }
        var _this = _super.call(this) || this;
        if (resolver)
            _this.resolveUsing(resolver, forceSynchronous);
        return _this;
    }
    Promise.prototype.thenSynchronous = function (onFulfilled, onRejected) {
        this.throwIfDisposed();
        // Already fulfilled?
        if (this._state)
            return _super.prototype.thenSynchronous.call(this, onFulfilled, onRejected);
        var p = new Promise();
        (this._waiting || (this._waiting = []))
            .push(Pool.init(onFulfilled, onRejected, p));
        return p;
    };
    Promise.prototype.doneNow = function (onFulfilled, onRejected) {
        this.throwIfDisposed();
        // Already fulfilled?
        if (this._state)
            return _super.prototype.doneNow.call(this, onFulfilled, onRejected);
        (this._waiting || (this._waiting = []))
            .push(Pool.init(onFulfilled, onRejected));
    };
    Promise.prototype._onDispose = function () {
        _super.prototype._onDispose.call(this);
        this._resolvedCalled = VOID0;
    };
    Promise.prototype.resolveUsing = function (resolver, forceSynchronous) {
        var _this = this;
        if (forceSynchronous === void 0) { forceSynchronous = false; }
        if (!resolver)
            throw new ArgumentNullException("resolver");
        if (this._resolvedCalled)
            throw new InvalidOperationException(".resolve() already called.");
        if (this.state)
            throw new InvalidOperationException("Already resolved: " + PromiseStateValue[this.state]);
        this._resolvedCalled = true;
        var state = 0;
        var rejectHandler = function (reason) {
            if (state) {
                // Someone else's promise handling down stream could double call this. :\
                console.warn(state == -1
                    ? "Rejection called multiple times"
                    : "Rejection called after fulfilled.");
            }
            else {
                state = -1;
                _this._resolvedCalled = false;
                _this.reject(reason);
            }
        };
        var fulfillHandler = function (v) {
            if (state) {
                // Someone else's promise handling down stream could double call this. :\
                console.warn(state == 1
                    ? "Fulfill called multiple times"
                    : "Fulfill called after rejection.");
            }
            else {
                state = 1;
                _this._resolvedCalled = false;
                _this.resolve(v);
            }
        };
        // There are some performance edge cases where there caller is not blocking upstream and does not need to defer.
        if (forceSynchronous)
            resolver(fulfillHandler, rejectHandler);
        else
            deferImmediate(function () { return resolver(fulfillHandler, rejectHandler); });
    };
    Promise.prototype._emitDisposalRejection = function (p) {
        var d = p.wasDisposed;
        if (d)
            this._rejectInternal(newODE());
        return d;
    };
    Promise.prototype._resolveInternal = function (result) {
        var _this = this;
        if (this.wasDisposed)
            return;
        // Note: Avoid recursion if possible.
        // Check ahead of time for resolution and resolve appropriately
        while (result instanceof PromiseBase) {
            var r = result;
            if (this._emitDisposalRejection(r))
                return;
            switch (r.state) {
                case PromiseStateValue.Pending:
                    r.doneNow(function (v) { return _this._resolveInternal(v); }, function (e) { return _this._rejectInternal(e); });
                    return;
                case PromiseStateValue.Rejected:
                    this._rejectInternal(r.error);
                    return;
                case PromiseStateValue.Fulfilled:
                    result = r.result;
                    break;
            }
        }
        if (isPromise(result)) {
            result.then(function (v) { return _this._resolveInternal(v); }, function (e) { return _this._rejectInternal(e); });
        }
        else {
            this._state = PromiseStateValue.Fulfilled;
            this._result = result;
            this._error = VOID0;
            var o = this._waiting;
            if (o) {
                this._waiting = VOID0;
                for (var _i = 0, o_1 = o; _i < o_1.length; _i++) {
                    var c = o_1[_i];
                    var onFulfilled = c.onFulfilled, promise = c.promise;
                    Pool.recycle(c);
                    //let ex =
                    handleResolution(promise, result, onFulfilled);
                }
                o.length = 0;
            }
        }
    };
    Promise.prototype._rejectInternal = function (error) {
        if (this.wasDisposed)
            return;
        this._state = PromiseStateValue.Rejected;
        this._error = error;
        var o = this._waiting;
        if (o) {
            this._waiting = null; // null = finished. undefined = hasn't started.
            for (var _i = 0, o_2 = o; _i < o_2.length; _i++) {
                var c = o_2[_i];
                var onRejected = c.onRejected, promise = c.promise;
                Pool.recycle(c);
                if (onRejected) {
                    //let ex =
                    handleResolution(promise, error, onRejected);
                    //if(!p && ex) console.error("Unhandled exception in onRejected:",ex);
                }
                else if (promise) { //noinspection JSIgnoredPromiseFromCall
                    promise.reject(error);
                }
            }
            o.length = 0;
        }
    };
    Promise.prototype.resolve = function (result, throwIfSettled) {
        if (throwIfSettled === void 0) { throwIfSettled = false; }
        this.throwIfDisposed();
        if (result == this)
            throw new InvalidOperationException("Cannot resolve a promise as itself.");
        if (this._state) {
            // Same value? Ignore...
            if (!throwIfSettled || this._state == PromiseStateValue.Fulfilled && this._result === result)
                return;
            throw new InvalidOperationException("Changing the fulfilled state/value of a promise is not supported.");
        }
        if (this._resolvedCalled) {
            if (throwIfSettled)
                throw new InvalidOperationException(".resolve() already called.");
            return;
        }
        this._resolveInternal(result);
    };
    Promise.prototype.reject = function (error, throwIfSettled) {
        if (throwIfSettled === void 0) { throwIfSettled = false; }
        this.throwIfDisposed();
        if (this._state) {
            // Same value? Ignore...
            if (!throwIfSettled || this._state == PromiseStateValue.Rejected && this._error === error)
                return;
            throw new InvalidOperationException("Changing the rejected state/value of a promise is not supported.");
        }
        if (this._resolvedCalled) {
            if (throwIfSettled)
                throw new InvalidOperationException(".resolve() already called.");
            return;
        }
        this._rejectInternal(error);
    };
    return Promise;
}(Resolvable));
export { Promise };
var Pool;
(function (Pool) {
    var pool;
    //noinspection JSUnusedLocalSymbols
    function getPool() {
        return pool
            || (pool = new ObjectPool(40, factory, function (c) {
                c.onFulfilled = NULL;
                c.onRejected = NULL;
                c.promise = NULL;
            }));
    }
    function factory() {
        return {
            onFulfilled: NULL,
            onRejected: NULL,
            promise: NULL
        };
    }
    function init(onFulfilled, onRejected, promise) {
        var c = getPool().take();
        c.onFulfilled = onFulfilled || undefined;
        c.onRejected = onRejected || undefined;
        c.promise = promise;
        return c;
    }
    Pool.init = init;
    function recycle(c) {
        getPool().add(c);
    }
    Pool.recycle = recycle;
})(Pool || (Pool = {}));
export default Promise;
//# sourceMappingURL=Promise.js.map