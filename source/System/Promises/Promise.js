/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Although most of the following code is written from scratch, it is
 * heavily influenced by Q (https://github.com/kriskowal/q) and uses some of Q's spec.
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Types", "../Threading/deferImmediate", "../Disposable/DisposableBase", "../Exceptions/InvalidOperationException", "../Exceptions/ArgumentException", "../Exceptions/ArgumentNullException", "../Disposable/ObjectPool", "../Collections/Set", "../Threading/defer", "../Disposable/ObjectDisposedException"], factory);
    }
})(function (require, exports) {
    "use strict";
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
    var VOID0 = void 0, PROMISE = "Promise", PROMISE_STATE = PROMISE + "State", THEN = "then", TARGET = "target";
    function isPromise(value) {
        return Types_1.default.hasMemberOfType(value, THEN, Types_1.default.FUNCTION);
    }
    function resolve(value, resolver, promiseFactory) {
        var nextValue = resolver
            ? resolver(value)
            : value;
        return nextValue && isPromise(nextValue)
            ? Promise.wrap(nextValue)
            : promiseFactory(nextValue);
    }
    function handleResolution(p, value, resolver) {
        try {
            var v = resolver ? resolver(value) : value;
            if (p)
                p.resolve(v);
        }
        catch (ex) {
            p.reject(ex);
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
        if (p instanceof PromiseBase)
            p.thenThis(onFulfilled, onRejected);
        else
            p.then(onFulfilled, onRejected);
    }
    function newODE() {
        return new ObjectDisposedException_1.ObjectDisposedException("Promise", "An underlying promise-result was disposed.");
    }
    var PromiseState = (function (_super) {
        __extends(PromiseState, _super);
        function PromiseState(_state, _result, _error) {
            _super.call(this);
            this._state = _state;
            this._result = _result;
            this._error = _error;
            this._disposableObjectName = PROMISE_STATE;
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
                return this.getState() === Promise.State.Pending;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PromiseState.prototype, "isSettled", {
            get: function () {
                return this.getState() != Promise.State.Pending;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PromiseState.prototype, "isFulfilled", {
            get: function () {
                return this.getState() === Promise.State.Fulfilled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PromiseState.prototype, "isRejected", {
            get: function () {
                return this.getState() === Promise.State.Rejected;
            },
            enumerable: true,
            configurable: true
        });
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
            _super.call(this, Promise.State.Pending);
            this._disposableObjectName = PROMISE;
        }
        PromiseBase.prototype.then = function (onFulfilled, onRejected) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.thenThis(function (result) { return handleResolutionMethods(resolve, reject, result, onFulfilled); }, function (error) { return onRejected
                    ? handleResolutionMethods(resolve, null, error, onRejected)
                    : reject(error); });
            });
        };
        PromiseBase.prototype.done = function (onFulfilled, onRejected) {
            var _this = this;
            defer_1.defer(function () { return _this.thenThis(onFulfilled, onRejected); });
        };
        PromiseBase.prototype.delayFromNow = function (milliseconds) {
            var _this = this;
            if (milliseconds === void 0) { milliseconds = 0; }
            this.throwIfDisposed();
            return new Promise(function (resolve, reject) {
                defer_1.defer(function () {
                    _this.thenThis(function (v) { return resolve(v); }, function (e) { return reject(e); });
                }, milliseconds);
            }, true);
        };
        PromiseBase.prototype.delayAfterResolve = function (milliseconds) {
            var _this = this;
            if (milliseconds === void 0) { milliseconds = 0; }
            this.throwIfDisposed();
            if (this.isSettled)
                return this.delayFromNow(milliseconds);
            return new Promise(function (resolve, reject) {
                _this.thenThis(function (v) { return defer_1.defer(function () { return resolve(v); }, milliseconds); }, function (e) { return defer_1.defer(function () { return reject(e); }, milliseconds); });
            }, true);
        };
        PromiseBase.prototype['catch'] = function (onRejected) {
            this.throwIfDisposed();
            return this.then(VOID0, onRejected);
        };
        PromiseBase.prototype['finally'] = function (fin) {
            this.throwIfDisposed();
            return this.then(fin, fin);
        };
        PromiseBase.prototype.finallyThis = function (fin) {
            this.throwIfDisposed();
            var f = function () { return deferImmediate_1.deferImmediate(fin); };
            this.thenThis(f, f);
            return this;
        };
        return PromiseBase;
    }(PromiseState));
    exports.PromiseBase = PromiseBase;
    var Resolvable = (function (_super) {
        __extends(Resolvable, _super);
        function Resolvable() {
            _super.apply(this, arguments);
        }
        Resolvable.prototype.thenSynchronous = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            try {
                switch (this.state) {
                    case Promise.State.Fulfilled:
                        return onFulfilled
                            ? resolve(this._result, onFulfilled, Promise.resolve)
                            : this;
                    case Promise.State.Rejected:
                        return onRejected
                            ? resolve(this._error, onRejected, Promise.resolve)
                            : this;
                }
            }
            catch (ex) {
                return new Rejected(ex);
            }
            throw new Error("Invalid state for a resolved promise.");
        };
        Resolvable.prototype.thenThis = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            switch (this.state) {
                case Promise.State.Fulfilled:
                    if (onFulfilled)
                        onFulfilled(this._result);
                    break;
                case Promise.State.Rejected:
                    if (onRejected)
                        onRejected(this._error);
                    break;
            }
            return this;
        };
        return Resolvable;
    }(PromiseBase));
    exports.Resolvable = Resolvable;
    var Resolved = (function (_super) {
        __extends(Resolved, _super);
        function Resolved(state, result, error) {
            _super.call(this);
            this._result = result;
            this._error = error;
            this._state = state;
        }
        return Resolved;
    }(Resolvable));
    exports.Resolved = Resolved;
    var Fulfilled = (function (_super) {
        __extends(Fulfilled, _super);
        function Fulfilled(value) {
            _super.call(this, Promise.State.Fulfilled, value);
        }
        return Fulfilled;
    }(Resolved));
    var Rejected = (function (_super) {
        __extends(Rejected, _super);
        function Rejected(error) {
            _super.call(this, Promise.State.Rejected, VOID0, error);
        }
        return Rejected;
    }(Resolved));
    var PromiseWrapper = (function (_super) {
        __extends(PromiseWrapper, _super);
        function PromiseWrapper(_target) {
            var _this = this;
            _super.call(this);
            this._target = _target;
            if (!_target)
                throw new ArgumentNullException_1.ArgumentNullException(TARGET);
            if (!isPromise(_target))
                throw new ArgumentException_1.ArgumentException(TARGET, "Must be a promise-like object.");
            _target.then(function (v) {
                _this._state = Promise.State.Fulfilled;
                _this._result = v;
                _this._error = VOID0;
                _this._target = VOID0;
            }, function (e) {
                _this._state = Promise.State.Rejected;
                _this._error = e;
                _this._target = VOID0;
            });
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
        PromiseWrapper.prototype.thenThis = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            var t = this._target;
            if (!t)
                return _super.prototype.thenThis.call(this, onFulfilled, onRejected);
            handleDispatch(t, onFulfilled, onRejected);
            return this;
        };
        PromiseWrapper.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this._target = VOID0;
        };
        return PromiseWrapper;
    }(Resolvable));
    var Promise = (function (_super) {
        __extends(Promise, _super);
        function Promise(resolver, forceSynchronous) {
            if (forceSynchronous === void 0) { forceSynchronous = false; }
            _super.call(this);
            if (resolver)
                this.resolveUsing(resolver, forceSynchronous);
        }
        Promise.prototype.thenSynchronous = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            if (this._state)
                return _super.prototype.thenSynchronous.call(this, onFulfilled, onRejected);
            var p = new Promise();
            (this._waiting || (this._waiting = []))
                .push(pools.PromiseCallbacks.init(onFulfilled, onRejected, p));
            return p;
        };
        Promise.prototype.thenThis = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            if (this._state)
                return _super.prototype.thenThis.call(this, onFulfilled, onRejected);
            (this._waiting || (this._waiting = []))
                .push(pools.PromiseCallbacks.init(onFulfilled, onRejected));
            return this;
        };
        Promise.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this._resolvedCalled = VOID0;
        };
        Promise.prototype.resolveUsing = function (resolver, forceSynchronous, throwIfSettled) {
            var _this = this;
            if (forceSynchronous === void 0) { forceSynchronous = false; }
            if (throwIfSettled === void 0) { throwIfSettled = false; }
            if (!resolver)
                throw new ArgumentNullException_1.ArgumentNullException("resolver");
            if (this._resolvedCalled)
                throw new InvalidOperationException_1.InvalidOperationException(".resolve() already called.");
            if (this.state)
                throw new InvalidOperationException_1.InvalidOperationException("Already resolved: " + Promise.State[this.state]);
            this._resolvedCalled = true;
            var state = 0;
            var rejectHandler = function (reason) {
                if (state) {
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
            if (forceSynchronous)
                resolver(fulfillHandler, rejectHandler);
            else
                deferImmediate_1.deferImmediate(function () { return resolver(fulfillHandler, rejectHandler); });
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
            while (result instanceof PromiseBase) {
                var r = result;
                if (this._emitDisposalRejection(r))
                    return;
                switch (r.state) {
                    case Promise.State.Pending:
                        r.thenSynchronous(function (v) { return _this._resolveInternal(v); }, function (e) { return _this._rejectInternal(e); });
                        return;
                    case Promise.State.Rejected:
                        this._rejectInternal(r.error);
                        return;
                    case Promise.State.Fulfilled:
                        result = r.result;
                        break;
                }
            }
            if (isPromise(result)) {
                result.then(function (v) { return _this._resolveInternal(v); }, function (e) { return _this._rejectInternal(e); });
            }
            else {
                this._state = Promise.State.Fulfilled;
                this._result = result;
                this._error = VOID0;
                var o = this._waiting;
                if (o) {
                    this._waiting = VOID0;
                    for (var _i = 0, o_1 = o; _i < o_1.length; _i++) {
                        var c = o_1[_i];
                        var onFulfilled = c.onFulfilled, promise = c.promise, p = promise;
                        pools.PromiseCallbacks.recycle(c);
                        handleResolution(p, result, onFulfilled);
                    }
                    o.length = 0;
                }
            }
        };
        Promise.prototype._rejectInternal = function (error) {
            if (this.wasDisposed)
                return;
            this._state = Promise.State.Rejected;
            this._error = error;
            var o = this._waiting;
            if (o) {
                this._waiting = null;
                for (var _i = 0, o_2 = o; _i < o_2.length; _i++) {
                    var c = o_2[_i];
                    var onRejected = c.onRejected, promise = c.promise, p = promise;
                    pools.PromiseCallbacks.recycle(c);
                    if (onRejected)
                        handleResolution(p, error, onRejected);
                    else
                        p.reject(error);
                }
                o.length = 0;
            }
        };
        Promise.prototype.resolve = function (result, throwIfSettled) {
            if (throwIfSettled === void 0) { throwIfSettled = false; }
            this.throwIfDisposed();
            if (result == this)
                throw new InvalidOperationException_1.InvalidOperationException("Cannot resolve a promise as itself.");
            if (this._state) {
                if (!throwIfSettled || this._state == Promise.State.Fulfilled && this._result === result)
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
        Promise.prototype.reject = function (error, throwIfSettled) {
            if (throwIfSettled === void 0) { throwIfSettled = false; }
            this.throwIfDisposed();
            if (this._state) {
                if (!throwIfSettled || this._state == Promise.State.Rejected && this._error === error)
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
        return Promise;
    }(Resolvable));
    exports.Promise = Promise;
    var pools;
    (function (pools) {
        var PromiseCallbacks;
        (function (PromiseCallbacks) {
            var pool;
            function getPool() {
                return pool
                    || (pool = new ObjectPool_1.ObjectPool(40, factory, function (c) {
                        c.onFulfilled = null;
                        c.onRejected = null;
                        c.promise = null;
                    }));
            }
            function factory() {
                return {
                    onFulfilled: null,
                    onRejected: null,
                    promise: null
                };
            }
            function init(onFulfilled, onRejected, promise) {
                var c = getPool().take();
                c.onFulfilled = onFulfilled;
                c.onRejected = onRejected;
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
    var Promise;
    (function (Promise) {
        (function (State) {
            State[State["Pending"] = 0] = "Pending";
            State[State["Fulfilled"] = 1] = "Fulfilled";
            State[State["Rejected"] = -1] = "Rejected";
        })(Promise.State || (Promise.State = {}));
        var State = Promise.State;
        Object.freeze(State);
        function all(first) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            if (!first && !rest.length)
                throw new ArgumentNullException_1.ArgumentNullException("promises");
            var promises = (Array.isArray(first) ? first : [first]).concat(rest);
            if (!promises.length || promises.every(function (v) { return !v; }))
                return new Fulfilled(promises);
            return new Promise(function (resolve, reject) {
                var checkedAll = false;
                var result = [];
                var len = promises.length;
                result.length = len;
                var remaining = new Set_1.Set(promises.map(function (v, i) { return i; }));
                var cleanup = function () {
                    reject = null;
                    resolve = null;
                    promises.length = 0;
                    promises = null;
                    remaining.dispose();
                    remaining = null;
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
                var _loop_1 = function(i) {
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
        Promise.all = all;
        function waitAll(first) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            if (!first && !rest.length)
                throw new ArgumentNullException_1.ArgumentNullException("promises");
            var promises = (Array.isArray(first) ? first : [first]).concat(rest);
            if (!promises.length || promises.every(function (v) { return !v; }))
                return new Fulfilled(promises);
            return new Promise(function (resolve, reject) {
                var checkedAll = false;
                var len = promises.length;
                var remaining = new Set_1.Set(promises.map(function (v, i) { return i; }));
                var cleanup = function () {
                    reject = null;
                    resolve = null;
                    remaining.dispose();
                    remaining = null;
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
                var _loop_2 = function(i) {
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
        Promise.waitAll = waitAll;
        function race(first) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            var promises = first && (Array.isArray(first) ? first : [first]).concat(rest);
            if (!promises || !promises.length || !(promises = promises.filter(function (v) { return v != null; })).length)
                throw new ArgumentException_1.ArgumentException("Nothing to wait for.");
            var len = promises.length;
            if (len == 1)
                return wrap(promises[0]);
            for (var i = 0; i < len; i++) {
                var p = promises[i];
                if (p instanceof PromiseBase && p.isSettled)
                    return p;
            }
            return new Promise(function (resolve, reject) {
                var cleanup = function () {
                    reject = null;
                    resolve = null;
                    promises.length = 0;
                    promises = null;
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
                    var p_1 = promises_1[_i];
                    if (!resolve)
                        break;
                    p_1.then(onFulfill, onReject);
                }
            });
        }
        Promise.race = race;
        function resolve(value) {
            return isPromise(value) ? wrap(value) : new Fulfilled(value);
        }
        Promise.resolve = resolve;
        function reject(reason) {
            return new Rejected(reason);
        }
        Promise.reject = reject;
        function wrap(target) {
            if (!target)
                throw new ArgumentNullException_1.ArgumentNullException(TARGET);
            return target instanceof PromiseBase ? target : new PromiseWrapper(target);
        }
        Promise.wrap = wrap;
        function createFrom(then) {
            if (!then)
                throw new ArgumentNullException_1.ArgumentNullException(THEN);
            return new PromiseWrapper({ then: then });
        }
        Promise.createFrom = createFrom;
    })(Promise = exports.Promise || (exports.Promise = {}));
});
//# sourceMappingURL=Promise.js.map