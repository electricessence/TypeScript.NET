"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Although most of the following code is written from scratch, it is
 * heavily influenced by Q (https://github.com/kriskowal/q) and uses some of Q's spec.
 */
/*
 * Resources:
 * https://promisesaplus.com/
 * https://github.com/kriskowal/q
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../Types");
var deferImmediate_1 = require("../Threading/deferImmediate");
var DisposableBase_1 = require("../Disposable/DisposableBase");
var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
var ArgumentException_1 = require("../Exceptions/ArgumentException");
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var ObjectPool_1 = require("../Disposable/ObjectPool");
var Set_1 = require("../Collections/Set");
var defer_1 = require("../Threading/defer");
var ObjectDisposedException_1 = require("../Disposable/ObjectDisposedException");
var extends_1 = require("../../extends");
//noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var VOID0 = void 0, NULL = null, PROMISE = "Promise", PROMISE_STATE = PROMISE + "State", THEN = "then", TARGET = "target";
function isPromise(value) {
    return Types_1.default.hasMemberOfType(value, THEN, Types_1.default.FUNCTION);
}
function resolve(value, resolver, promiseFactory) {
    var nextValue = resolver
        ? resolver(value)
        : value;
    return nextValue && isPromise(nextValue)
        ? TSDNPromise.wrap(nextValue)
        : promiseFactory(nextValue);
}
function handleResolution(p, value, resolver) {
    try {
        var v = resolver ? resolver(value) : value;
        if (p) {
            p.resolve(v);
        }
        return null;
    }
    catch (ex) {
        if (p) {
            p.reject(ex);
        }
        return ex;
    }
}
function handleResolutionMethods(targetFulfill, targetReject, value, resolver) {
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
function handleDispatch(p, onFulfilled, onRejected) {
    if (p instanceof PromiseBase) {
        p.doneNow(onFulfilled, onRejected);
    }
    else {
        p.then(onFulfilled, onRejected);
    }
}
function handleSyncIfPossible(p, onFulfilled, onRejected) {
    if (p instanceof PromiseBase)
        return p.thenSynchronous(onFulfilled, onRejected);
    else
        return p.then(onFulfilled, onRejected);
}
function newODE() {
    return new ObjectDisposedException_1.ObjectDisposedException("TSDNPromise", "An underlying promise-result was disposed.");
}
var PromiseState = (function (_super) {
    __extends(PromiseState, _super);
    function PromiseState(_state, _result, _error) {
        var _this = _super.call(this) || this;
        _this._state = _state;
        _this._result = _result;
        _this._error = _error;
        _this._disposableObjectName = PROMISE_STATE;
        return _this;
    }
    PromiseState.prototype._onDispose = function () {
        this._state = VOID0;
        this._result = VOID0;
        this._error = VOID0;
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
            return this.getState() === TSDNPromise.State.Pending;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PromiseState.prototype, "isSettled", {
        get: function () {
            return this.getState() != TSDNPromise.State.Pending; // Will also include undefined==0 aka disposed!=resolved.
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PromiseState.prototype, "isFulfilled", {
        get: function () {
            return this.getState() === TSDNPromise.State.Fulfilled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PromiseState.prototype, "isRejected", {
        get: function () {
            return this.getState() === TSDNPromise.State.Rejected;
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
}(DisposableBase_1.DisposableBase));
exports.PromiseState = PromiseState;
var PromiseBase = (function (_super) {
    __extends(PromiseBase, _super);
    function PromiseBase() {
        var _this = _super.call(this, TSDNPromise.State.Pending) || this;
        _this._disposableObjectName = PROMISE;
        return _this;
    }
    PromiseBase.prototype.thenThis = function (onFulfilled, onRejected) {
        this.doneNow(onFulfilled, onRejected);
        return this;
    };
    /**
     * Standard .then method that defers execution until resolved.
     * @param onFulfilled
     * @param onRejected
     * @returns {TSDNPromise}
     */
    PromiseBase.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        this.throwIfDisposed();
        return new TSDNPromise(function (resolve, reject) {
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
     * @returns {TSDNPromise}
     */
    PromiseBase.prototype.thenAllowFatal = function (onFulfilled, onRejected) {
        var _this = this;
        this.throwIfDisposed();
        return new TSDNPromise(function (resolve, reject) {
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
        defer_1.defer(function () { return _this.doneNow(onFulfilled, onRejected); });
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
        return new TSDNPromise(function (resolve, reject) {
            defer_1.defer(function () {
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
        return new TSDNPromise(function (resolve, reject) {
            _this.doneNow(function (v) { return defer_1.defer(function () { return resolve(v); }, milliseconds); }, function (e) { return defer_1.defer(function () { return reject(e); }, milliseconds); });
        }, true // Since the resolve/reject is deferred.
        );
    };
    /**
     * Shortcut for trapping a rejection.
     * @param onRejected
     * @returns {PromiseBase<TResult>}
     */
    PromiseBase.prototype['catch'] = function (onRejected) {
        return this.then(VOID0, onRejected);
    };
    /**
     * Shortcut for trapping a rejection but will allow exceptions to propagate within the onRejected handler.
     * @param onRejected
     * @returns {PromiseBase<TResult>}
     */
    PromiseBase.prototype.catchAllowFatal = function (onRejected) {
        return this.thenAllowFatal(VOID0, onRejected);
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
        var f = synchronous ? fin : function () { return deferImmediate_1.deferImmediate(fin); };
        this.doneNow(f, f);
        return this;
    };
    return PromiseBase;
}(PromiseState));
exports.PromiseBase = PromiseBase;
var Resolvable = (function (_super) {
    __extends(Resolvable, _super);
    function Resolvable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Resolvable.prototype.doneNow = function (onFulfilled, onRejected) {
        this.throwIfDisposed();
        switch (this.state) {
            case TSDNPromise.State.Fulfilled:
                if (onFulfilled)
                    onFulfilled(this._result);
                break;
            case TSDNPromise.State.Rejected:
                if (onRejected)
                    onRejected(this._error);
                break;
        }
    };
    Resolvable.prototype.thenSynchronous = function (onFulfilled, onRejected) {
        this.throwIfDisposed();
        try {
            switch (this.state) {
                case TSDNPromise.State.Fulfilled:
                    return onFulfilled
                        ? resolve(this._result, onFulfilled, TSDNPromise.resolve)
                        : this; // Provided for catch cases.
                case TSDNPromise.State.Rejected:
                    return onRejected
                        ? resolve(this._error, onRejected, TSDNPromise.resolve)
                        : this;
            }
        }
        catch (ex) {
            return new Rejected(ex);
        }
        throw new Error("Invalid state for a resolved promise.");
    };
    return Resolvable;
}(PromiseBase));
exports.Resolvable = Resolvable;
/**
 * The simplest usable version of a promise which returns synchronously the resolved state provided.
 */
var Resolved = (function (_super) {
    __extends(Resolved, _super);
    function Resolved(state, result, error) {
        var _this = _super.call(this) || this;
        _this._result = result;
        _this._error = error;
        _this._state = state;
        return _this;
    }
    return Resolved;
}(Resolvable));
exports.Resolved = Resolved;
/**
 * A fulfilled Resolved<T>.  Provided for readability.
 */
var Fulfilled = (function (_super) {
    __extends(Fulfilled, _super);
    function Fulfilled(value) {
        return _super.call(this, TSDNPromise.State.Fulfilled, value) || this;
    }
    return Fulfilled;
}(Resolved));
exports.Fulfilled = Fulfilled;
/**
 * A rejected Resolved<T>.  Provided for readability.
 */
var Rejected = (function (_super) {
    __extends(Rejected, _super);
    function Rejected(error) {
        return _super.call(this, TSDNPromise.State.Rejected, VOID0, error) || this;
    }
    return Rejected;
}(Resolved));
exports.Rejected = Rejected;
/**
 * Provided as a means for extending the interface of other PromiseLike<T> objects.
 */
var PromiseWrapper = (function (_super) {
    __extends(PromiseWrapper, _super);
    function PromiseWrapper(_target) {
        var _this = _super.call(this) || this;
        _this._target = _target;
        if (!_target)
            throw new ArgumentNullException_1.ArgumentNullException(TARGET);
        if (!isPromise(_target))
            throw new ArgumentException_1.ArgumentException(TARGET, "Must be a promise-like object.");
        _target.then(function (v) {
            _this._state = TSDNPromise.State.Fulfilled;
            _this._result = v;
            _this._error = VOID0;
            _this._target = VOID0;
        }, function (e) {
            _this._state = TSDNPromise.State.Rejected;
            _this._error = e;
            _this._target = VOID0;
        });
        return _this;
    }
    PromiseWrapper.prototype.thenSynchronous = function (onFulfilled, onRejected) {
        this.throwIfDisposed();
        var t = this._target;
        if (!t)
            return _super.prototype.thenSynchronous.call(this, onFulfilled, onRejected);
        return new TSDNPromise(function (resolve, reject) {
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
        this._target = VOID0;
    };
    return PromiseWrapper;
}(Resolvable));
/**
 * This promise class that facilitates pending resolution.
 */
var TSDNPromise = (function (_super) {
    __extends(TSDNPromise, _super);
    /*
     * A note about deferring:
     * The caller can set resolveImmediate to true if they intend to initialize code that will end up being deferred itself.
     * This eliminates the extra defer that will occur internally.
     * But for the most part, resolveImmediate = false (the default) will ensure the constructor will not block.
     *
     * resolveUsing allows for the same ability but does not defer by default: allowing the caller to take on the work load.
     * If calling resolve or reject and a deferred response is desired, then use deferImmediate with a closure to do so.
     */
    function TSDNPromise(resolver, forceSynchronous) {
        if (forceSynchronous === void 0) { forceSynchronous = false; }
        var _this = _super.call(this) || this;
        if (resolver)
            _this.resolveUsing(resolver, forceSynchronous);
        return _this;
    }
    TSDNPromise.prototype.thenSynchronous = function (onFulfilled, onRejected) {
        this.throwIfDisposed();
        // Already fulfilled?
        if (this._state)
            return _super.prototype.thenSynchronous.call(this, onFulfilled, onRejected);
        var p = new TSDNPromise();
        (this._waiting || (this._waiting = []))
            .push(pools.PromiseCallbacks.init(onFulfilled, onRejected, p));
        return p;
    };
    TSDNPromise.prototype.doneNow = function (onFulfilled, onRejected) {
        this.throwIfDisposed();
        // Already fulfilled?
        if (this._state)
            return _super.prototype.doneNow.call(this, onFulfilled, onRejected);
        (this._waiting || (this._waiting = []))
            .push(pools.PromiseCallbacks.init(onFulfilled, onRejected));
    };
    TSDNPromise.prototype._onDispose = function () {
        _super.prototype._onDispose.call(this);
        this._resolvedCalled = VOID0;
    };
    TSDNPromise.prototype.resolveUsing = function (resolver, forceSynchronous) {
        var _this = this;
        if (forceSynchronous === void 0) { forceSynchronous = false; }
        if (!resolver)
            throw new ArgumentNullException_1.ArgumentNullException("resolver");
        if (this._resolvedCalled)
            throw new InvalidOperationException_1.InvalidOperationException(".resolve() already called.");
        if (this.state)
            throw new InvalidOperationException_1.InvalidOperationException("Already resolved: " + TSDNPromise.State[this.state]);
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
            deferImmediate_1.deferImmediate(function () { return resolver(fulfillHandler, rejectHandler); });
    };
    TSDNPromise.prototype._emitDisposalRejection = function (p) {
        var d = p.wasDisposed;
        if (d)
            this._rejectInternal(newODE());
        return d;
    };
    TSDNPromise.prototype._resolveInternal = function (result) {
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
                case TSDNPromise.State.Pending:
                    r.doneNow(function (v) { return _this._resolveInternal(v); }, function (e) { return _this._rejectInternal(e); });
                    return;
                case TSDNPromise.State.Rejected:
                    this._rejectInternal(r.error);
                    return;
                case TSDNPromise.State.Fulfilled:
                    result = r.result;
                    break;
            }
        }
        if (isPromise(result)) {
            result.then(function (v) { return _this._resolveInternal(v); }, function (e) { return _this._rejectInternal(e); });
        }
        else {
            this._state = TSDNPromise.State.Fulfilled;
            this._result = result;
            this._error = VOID0;
            var o = this._waiting;
            if (o) {
                this._waiting = VOID0;
                for (var _i = 0, o_1 = o; _i < o_1.length; _i++) {
                    var c = o_1[_i];
                    var onFulfilled = c.onFulfilled, promise = c.promise;
                    pools.PromiseCallbacks.recycle(c);
                    //let ex =
                    handleResolution(promise, result, onFulfilled);
                    //if(!p && ex) console.error("Unhandled exception in onFulfilled:",ex);
                }
                o.length = 0;
            }
        }
    };
    TSDNPromise.prototype._rejectInternal = function (error) {
        if (this.wasDisposed)
            return;
        this._state = TSDNPromise.State.Rejected;
        this._error = error;
        var o = this._waiting;
        if (o) {
            this._waiting = null; // null = finished. undefined = hasn't started.
            for (var _i = 0, o_2 = o; _i < o_2.length; _i++) {
                var c = o_2[_i];
                var onRejected = c.onRejected, promise = c.promise;
                pools.PromiseCallbacks.recycle(c);
                if (onRejected) {
                    //let ex =
                    handleResolution(promise, error, onRejected);
                    //if(!p && ex) console.error("Unhandled exception in onRejected:",ex);
                }
                else if (promise) {
                    promise.reject(error);
                }
            }
            o.length = 0;
        }
    };
    TSDNPromise.prototype.resolve = function (result, throwIfSettled) {
        if (throwIfSettled === void 0) { throwIfSettled = false; }
        this.throwIfDisposed();
        if (result == this)
            throw new InvalidOperationException_1.InvalidOperationException("Cannot resolve a promise as itself.");
        if (this._state) {
            // Same value? Ignore...
            if (!throwIfSettled || this._state == TSDNPromise.State.Fulfilled && this._result === result)
                return;
            throw new InvalidOperationException_1.InvalidOperationException("Changing the fulfilled state/value of a promise is not supported.");
        }
        if (this._resolvedCalled) {
            if (throwIfSettled)
                throw new InvalidOperationException_1.InvalidOperationException(".resolve() already called.");
            return;
        }
        this._resolveInternal(result);
    };
    TSDNPromise.prototype.reject = function (error, throwIfSettled) {
        if (throwIfSettled === void 0) { throwIfSettled = false; }
        this.throwIfDisposed();
        if (this._state) {
            // Same value? Ignore...
            if (!throwIfSettled || this._state == TSDNPromise.State.Rejected && this._error === error)
                return;
            throw new InvalidOperationException_1.InvalidOperationException("Changing the rejected state/value of a promise is not supported.");
        }
        if (this._resolvedCalled) {
            if (throwIfSettled)
                throw new InvalidOperationException_1.InvalidOperationException(".resolve() already called.");
            return;
        }
        this._rejectInternal(error);
    };
    return TSDNPromise;
}(Resolvable));
exports.TSDNPromise = TSDNPromise;
exports.Promise = TSDNPromise;
/**
 * By providing an ArrayPromise we expose useful methods/shortcuts for dealing with array results.
 */
var ArrayPromise = (function (_super) {
    __extends(ArrayPromise, _super);
    function ArrayPromise() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Simplifies the use of a map function on an array of results when the source is assured to be an array.
     * @param transform
     * @returns {PromiseBase<Array<any>>}
     */
    ArrayPromise.prototype.map = function (transform) {
        var _this = this;
        this.throwIfDisposed();
        return new ArrayPromise(function (resolve) {
            _this.doneNow(function (result) { return resolve(result.map(transform)); });
        }, true);
    };
    /**
     * Simplifies the use of a reduce function on an array of results when the source is assured to be an array.
     * @param reduction
     * @param initialValue
     * @returns {PromiseBase<any>}
     */
    ArrayPromise.prototype.reduce = function (reduction, initialValue) {
        return this
            .thenSynchronous(function (result) { return result.reduce(reduction, initialValue); });
    };
    ArrayPromise.fulfilled = function (value) {
        return new ArrayPromise(function (resolve) { return value; }, true);
    };
    return ArrayPromise;
}(TSDNPromise));
exports.ArrayPromise = ArrayPromise;
var PROMISE_COLLECTION = "PromiseCollection";
/**
 * A Promise collection exposes useful methods for handling a collection of promises and their results.
 */
var PromiseCollection = (function (_super) {
    __extends(PromiseCollection, _super);
    function PromiseCollection(source) {
        var _this = _super.call(this) || this;
        _this._disposableObjectName = PROMISE_COLLECTION;
        _this._source = source && source.slice() || [];
        return _this;
    }
    PromiseCollection.prototype._onDispose = function () {
        _super.prototype._onDispose.call(this);
        this._source.length = 0;
        this._source = null;
    };
    Object.defineProperty(PromiseCollection.prototype, "promises", {
        /**
         * Returns a copy of the source promises.
         * @returns {PromiseLike<PromiseLike<any>>[]}
         */
        get: function () {
            this.throwIfDisposed();
            return this._source.slice();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
     * @returns {PromiseBase<any>}
     */
    PromiseCollection.prototype.all = function () {
        this.throwIfDisposed();
        return TSDNPromise.all(this._source);
    };
    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
     * or rejected.
     * @returns {PromiseBase<any>} A new Promise.
     */
    PromiseCollection.prototype.race = function () {
        this.throwIfDisposed();
        return TSDNPromise.race(this._source);
    };
    /**
     * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
     * Unlike .all this method waits for all rejections as well as fulfillment.
     * @returns {PromiseBase<PromiseLike<any>[]>}
     */
    PromiseCollection.prototype.waitAll = function () {
        this.throwIfDisposed();
        return TSDNPromise.waitAll(this._source);
    };
    /**
     * Waits for all the values to resolve and then applies a transform.
     * @param transform
     * @returns {PromiseBase<Array<any>>}
     */
    PromiseCollection.prototype.map = function (transform) {
        var _this = this;
        this.throwIfDisposed();
        return new ArrayPromise(function (resolve) {
            _this.all()
                .doneNow(function (result) { return resolve(result.map(transform)); });
        }, true);
    };
    /**
     * Applies a transform to each promise and defers the result.
     * Unlike map, this doesn't wait for all promises to resolve, ultimately improving the async nature of the request.
     * @param transform
     * @returns {PromiseCollection<U>}
     */
    PromiseCollection.prototype.pipe = function (transform) {
        this.throwIfDisposed();
        return new PromiseCollection(this._source.map(function (p) { return handleSyncIfPossible(p, transform); }));
    };
    /**
     * Behaves like array reduce.
     * Creates the promise chain necessary to produce the desired result.
     * @param reduction
     * @param initialValue
     * @returns {PromiseBase<PromiseLike<any>>}
     */
    PromiseCollection.prototype.reduce = function (reduction, initialValue) {
        this.throwIfDisposed();
        return TSDNPromise.wrap(this._source
            .reduce(function (previous, current, i, array) {
            return handleSyncIfPossible(previous, function (p) { return handleSyncIfPossible(current, function (c) { return reduction(p, c, i, array); }); });
        }, isPromise(initialValue)
            ? initialValue
            : new Fulfilled(initialValue)));
    };
    return PromiseCollection;
}(DisposableBase_1.DisposableBase));
exports.PromiseCollection = PromiseCollection;
var pools;
(function (pools) {
    // export module pending
    // {
    //
    //
    // 	var pool:ObjectPool<Promise<any>>;
    //
    // 	function getPool()
    // 	{
    // 		return pool || (pool = new ObjectPool<Promise<any>>(40, factory, c=>c.dispose()));
    // 	}
    //
    // 	function factory():Promise<any>
    // 	{
    // 		return new Promise();
    // 	}
    //
    // 	export function get():Promise<any>
    // 	{
    // 		var p:any = getPool().take();
    // 		p.__wasDisposed = false;
    // 		p._state = Promise.State.Pending;
    // 		return p;
    // 	}
    //
    // 	export function recycle<T>(c:Promise<T>):void
    // 	{
    // 		if(c) getPool().add(c);
    // 	}
    //
    // }
    //
    // export function recycle<T>(c:PromiseBase<T>):void
    // {
    // 	if(!c) return;
    // 	if(c instanceof Promise && c.constructor==Promise) pending.recycle(c);
    // 	else c.dispose();
    // }
    var PromiseCallbacks;
    (function (PromiseCallbacks) {
        var pool;
        //noinspection JSUnusedLocalSymbols
        function getPool() {
            return pool
                || (pool = new ObjectPool_1.ObjectPool(40, factory, function (c) {
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
        PromiseCallbacks.init = init;
        function recycle(c) {
            getPool().add(c);
        }
        PromiseCallbacks.recycle = recycle;
    })(PromiseCallbacks = pools.PromiseCallbacks || (pools.PromiseCallbacks = {}));
})(pools || (pools = {}));
(function (TSDNPromise) {
    /**
     * The state of a promise.
     * https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md
     * If a promise is disposed the value will be undefined which will also evaluate (promise.state)==false.
     */
    var State;
    (function (State) {
        State[State["Pending"] = 0] = "Pending";
        State[State["Fulfilled"] = 1] = "Fulfilled";
        State[State["Rejected"] = -1] = "Rejected";
    })(State = TSDNPromise.State || (TSDNPromise.State = {}));
    Object.freeze(State);
    function factory(e) {
        return new TSDNPromise(e);
    }
    TSDNPromise.factory = factory;
    function group(first) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (!first && !rest.length)
            throw new ArgumentNullException_1.ArgumentNullException("promises");
        return new PromiseCollection(((first) instanceof (Array) ? first : [first])
            .concat(rest));
    }
    TSDNPromise.group = group;
    function all(first) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (!first && !rest.length)
            throw new ArgumentNullException_1.ArgumentNullException("promises");
        var promises = ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy!
        if (!promises.length || promises.every(function (v) { return !v; }))
            return new ArrayPromise(function (r) { return r(promises); }, true); // it's a new empty, reuse it. :|
        // Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
        return new ArrayPromise(function (resolve, reject) {
            var result = [];
            var len = promises.length;
            result.length = len;
            // Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
            var remaining = new Set_1.Set(promises.map(function (v, i) { return i; })); // get all the indexes...
            var cleanup = function () {
                reject = VOID0;
                resolve = VOID0;
                promises.length = 0;
                promises = VOID0;
                remaining.dispose();
                remaining = VOID0;
            };
            var checkIfShouldResolve = function () {
                var r = resolve;
                if (r && !remaining.count) {
                    cleanup();
                    r(result);
                }
            };
            var onFulfill = function (v, i) {
                if (resolve) {
                    result[i] = v;
                    remaining.remove(i);
                    checkIfShouldResolve();
                }
            };
            var onReject = function (e) {
                var r = reject;
                if (r) {
                    cleanup();
                    r(e);
                }
            };
            var _loop_1 = function (i) {
                var p = promises[i];
                if (p)
                    p.then(function (v) { return onFulfill(v, i); }, onReject);
                else
                    remaining.remove(i);
                checkIfShouldResolve();
            };
            for (var i = 0; remaining && i < len; i++) {
                _loop_1(i);
            }
        });
    }
    TSDNPromise.all = all;
    function waitAll(first) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (!first && !rest.length)
            throw new ArgumentNullException_1.ArgumentNullException("promises");
        var promises = ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy!
        if (!promises.length || promises.every(function (v) { return !v; }))
            return new ArrayPromise(function (r) { return r(promises); }, true); // it's a new empty, reuse it. :|
        // Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
        return new ArrayPromise(function (resolve, reject) {
            var len = promises.length;
            // Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
            var remaining = new Set_1.Set(promises.map(function (v, i) { return i; })); // get all the indexes...
            var cleanup = function () {
                reject = NULL;
                resolve = NULL;
                remaining.dispose();
                remaining = NULL;
            };
            var checkIfShouldResolve = function () {
                var r = resolve;
                if (r && !remaining.count) {
                    cleanup();
                    r(promises);
                }
            };
            var onResolved = function (i) {
                if (remaining) {
                    remaining.remove(i);
                    checkIfShouldResolve();
                }
            };
            var _loop_2 = function (i) {
                var p = promises[i];
                if (p)
                    p.then(function (v) { return onResolved(i); }, function (e) { return onResolved(i); });
                else
                    onResolved(i);
            };
            for (var i = 0; remaining && i < len; i++) {
                _loop_2(i);
            }
        });
    }
    TSDNPromise.waitAll = waitAll;
    function race(first) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var promises = first && ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy?
        if (!promises || !promises.length || !(promises = promises.filter(function (v) { return v != null; })).length)
            throw new ArgumentException_1.ArgumentException("Nothing to wait for.");
        var len = promises.length;
        // Only one?  Nothing to race.
        if (len == 1)
            return wrap(promises[0]);
        // Look for already resolved promises and the first one wins.
        for (var i = 0; i < len; i++) {
            var p = promises[i];
            if (p instanceof PromiseBase && p.isSettled)
                return p;
        }
        return new TSDNPromise(function (resolve, reject) {
            var cleanup = function () {
                reject = NULL;
                resolve = NULL;
                promises.length = 0;
                promises = NULL;
            };
            var onResolve = function (r, v) {
                if (r) {
                    cleanup();
                    r(v);
                }
            };
            var onFulfill = function (v) { return onResolve(resolve, v); };
            var onReject = function (e) { return onResolve(reject, e); };
            for (var _i = 0, promises_1 = promises; _i < promises_1.length; _i++) {
                var p = promises_1[_i];
                if (!resolve)
                    break;
                p.then(onFulfill, onReject);
            }
        });
    }
    TSDNPromise.race = race;
    function resolve(value) {
        return isPromise(value) ? wrap(value) : new Fulfilled(value);
    }
    TSDNPromise.resolve = resolve;
    /**
     * Syntactic shortcut for avoiding 'new'.
     * @param resolver
     * @param forceSynchronous
     * @returns {TSDNPromise}
     */
    function using(resolver, forceSynchronous) {
        if (forceSynchronous === void 0) { forceSynchronous = false; }
        return new TSDNPromise(resolver, forceSynchronous);
    }
    TSDNPromise.using = using;
    function resolveAll(first) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (!first && !rest.length)
            throw new ArgumentNullException_1.ArgumentNullException("resolutions");
        return new PromiseCollection(((first) instanceof (Array) ? first : [first])
            .concat(rest)
            .map(function (v) { return resolve(v); }));
    }
    TSDNPromise.resolveAll = resolveAll;
    /**
     * Creates a PromiseCollection containing promises that will resolve on the next tick using the transform function.
     * This utility function does not chain promises together to create the result,
     * it only uses one promise per transform.
     * @param source
     * @param transform
     * @returns {PromiseCollection<T>}
     */
    function map(source, transform) {
        return new PromiseCollection(source.map(function (d) { return new TSDNPromise(function (r, j) {
            try {
                r(transform(d));
            }
            catch (ex) {
                j(ex);
            }
        }); }));
    }
    TSDNPromise.map = map;
    /**
     * Creates a new rejected promise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected Promise.
     */
    function reject(reason) {
        return new Rejected(reason);
    }
    TSDNPromise.reject = reject;
    /**
     * Takes any Promise-Like object and ensures an extended version of it from this module.
     * @param target The Promise-Like object
     * @returns A new target that simply extends the target.
     */
    function wrap(target) {
        if (!target)
            throw new ArgumentNullException_1.ArgumentNullException(TARGET);
        return isPromise(target)
            ? (target instanceof PromiseBase ? target : new PromiseWrapper(target))
            : new Fulfilled(target);
    }
    TSDNPromise.wrap = wrap;
    /**
     * A function that acts like a 'then' method (aka then-able) can be extended by providing a function that takes an onFulfill and onReject.
     * @param then
     * @returns {PromiseWrapper<T>}
     */
    function createFrom(then) {
        if (!then)
            throw new ArgumentNullException_1.ArgumentNullException(THEN);
        return new PromiseWrapper({ then: then });
    }
    TSDNPromise.createFrom = createFrom;
})(TSDNPromise = exports.TSDNPromise || (exports.TSDNPromise = {}));
exports.TSDNPromise = TSDNPromise;
exports.Promise = TSDNPromise;
exports.default = TSDNPromise;
//# sourceMappingURL=Promise.js.map