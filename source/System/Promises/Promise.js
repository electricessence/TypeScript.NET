/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Although most of the following code is written from scratch, it is
 * heavily influenced by Q (https://github.com/kriskowal/q) and uses some of Q's spec.
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
        define(["require", "exports", "../Types", "../Tasks/deferImmediate", "../Tasks/defer", "../Disposable/DisposableBase", "../Exceptions/InvalidOperationException", "../Exceptions/ArgumentException", "../Exceptions/ArgumentNullException", "../Disposable/ObjectPool"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var deferImmediate_1 = require("../Tasks/deferImmediate");
    var defer_1 = require("../Tasks/defer");
    var DisposableBase_1 = require("../Disposable/DisposableBase");
    var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
    var ArgumentException_1 = require("../Exceptions/ArgumentException");
    var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
    var ObjectPool_1 = require("../Disposable/ObjectPool");
    var VOID0 = void 0, PROMISE = "Promise", THEN = "then", TARGET = "target";
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
    function pass(source, dest) {
        return function () {
            source.then(function (v) {
                dest.fulfill(v);
                return dest;
            }, function (e) {
                dest.reject(e);
                return dest;
            });
        };
    }
    function handleFulfill(p, value, resolver) {
        try {
            p.fulfill(resolver ? resolver(value) : value);
        }
        catch (ex) {
            p.reject(ex);
        }
    }
    function handleReject(p, error, resolver) {
        try {
            p.reject(resolver ? resolver(error) : error);
        }
        catch (ex) {
            p.reject(ex);
        }
    }
    var Promise = (function (_super) {
        __extends(Promise, _super);
        function Promise() {
            _super.call(this);
            this._state = Promise.State.Pending;
            this._disposableObjectName = PROMISE;
        }
        Promise.prototype._onDispose = function () {
            this._state = VOID0;
            this._result = VOID0;
            this._error = VOID0;
        };
        Promise.prototype.getState = function () {
            return this._state;
        };
        Object.defineProperty(Promise.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Promise.prototype, "isPending", {
            get: function () {
                return this.getState() === Promise.State.Pending;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Promise.prototype, "isResolved", {
            get: function () {
                return this.getState() != Promise.State.Pending;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Promise.prototype, "isFulfilled", {
            get: function () {
                return this.getState() === Promise.State.Fulfilled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Promise.prototype, "isRejected", {
            get: function () {
                return this.getState() === Promise.State.Rejected;
            },
            enumerable: true,
            configurable: true
        });
        Promise.prototype.getResult = function () {
            return this._result;
        };
        Object.defineProperty(Promise.prototype, "result", {
            get: function () {
                this.throwIfDisposed();
                return this.getResult();
            },
            enumerable: true,
            configurable: true
        });
        Promise.prototype.getError = function () {
            return this._error;
        };
        Object.defineProperty(Promise.prototype, "error", {
            get: function () {
                this.throwIfDisposed();
                return this.getError();
            },
            enumerable: true,
            configurable: true
        });
        Promise.prototype.deferAll = function () {
            this.throwIfDisposed();
            return new Deferred(this);
        };
        Promise.prototype.defer = function () {
            this.throwIfDisposed();
            var p = new Pending();
            deferImmediate_1.deferImmediate(pass(this, p));
            return p;
        };
        Promise.prototype.delay = function (milliseconds) {
            this.throwIfDisposed();
            var p = new Pending();
            defer_1.defer(pass(this, p), milliseconds);
            return p;
        };
        Promise.prototype['catch'] = function (onRejected) {
            this.throwIfDisposed();
            return this.then(VOID0, onRejected);
        };
        Promise.prototype['finally'] = function (fin) {
            this.throwIfDisposed();
            return this.then(fin, fin);
        };
        return Promise;
    }(DisposableBase_1.DisposableBase));
    exports.Promise = Promise;
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
            }, function (e) {
                _this._state = Promise.State.Rejected;
                _this._error = e;
            });
        }
        PromiseWrapper.prototype.then = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            var p = new Pending();
            this._target.then(function (result) { return handleFulfill(p, result, onFulfilled); }, function (e) { return handleReject(p, e, onRejected); });
            return p;
        };
        PromiseWrapper.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this._target = null;
        };
        return PromiseWrapper;
    }(Promise));
    var Resolved = (function (_super) {
        __extends(Resolved, _super);
        function Resolved(state, result, error) {
            _super.call(this);
            this._result = result;
            this._error = error;
            this._state = state;
        }
        Resolved.prototype.then = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            try {
                return this._error === VOID0
                    ? resolve(this._result, onFulfilled, Promise.resolve)
                    : resolve(this._error, onRejected, Promise.reject);
            }
            catch (ex) {
                return new Rejected(ex);
            }
        };
        return Resolved;
    }(Promise));
    exports.Resolved = Resolved;
    var Fulfilled = (function (_super) {
        __extends(Fulfilled, _super);
        function Fulfilled(value) {
            _super.call(this, Promise.State.Fulfilled, value);
        }
        Fulfilled.prototype.then = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            try {
                return resolve(this._result, onFulfilled, Promise.resolve);
            }
            catch (ex) {
                return new Rejected(ex);
            }
        };
        return Fulfilled;
    }(Resolved));
    var Rejected = (function (_super) {
        __extends(Rejected, _super);
        function Rejected(error) {
            _super.call(this, Promise.State.Rejected, VOID0, error);
        }
        Rejected.prototype.then = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            try {
                return resolve(this._error, onRejected, Promise.reject);
            }
            catch (ex) {
                return new Rejected(ex);
            }
        };
        return Rejected;
    }(Resolved));
    var Pending = (function (_super) {
        __extends(Pending, _super);
        function Pending(resolver) {
            _super.call(this, Promise.State.Pending);
            if (resolver)
                this.resolve(resolver);
        }
        Pending.prototype.then = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            if (this._state)
                return _super.prototype.then.call(this, onFulfilled, onRejected);
            var p = new Pending();
            (this._waiting || (this._waiting = []))
                .push(PromiseCallbacks.init(onFulfilled, onRejected, p));
            return p;
        };
        Pending.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this._resolveCalled = VOID0;
        };
        Pending.prototype.resolve = function (resolver) {
            var _this = this;
            if (!resolver)
                throw new ArgumentNullException_1.ArgumentNullException("resolver");
            if (this._resolveCalled)
                throw new InvalidOperationException_1.InvalidOperationException(".resolve() already called.");
            if (this.state)
                throw new InvalidOperationException_1.InvalidOperationException("Already resolved: " + Promise.State[this.state]);
            this._resolveCalled = true;
            resolver(function (v) {
                if (v == _this)
                    throw new InvalidOperationException_1.InvalidOperationException("Cannot resolve a promise as itself.");
                if (isPromise(v)) {
                    v.then(function (f) { return _this.fulfill(f); }, function (r) { return _this.reject(r); });
                }
                else
                    _this.fulfill(v);
            }, function (reason) {
                _this.reject(reason);
            });
        };
        Pending.prototype.fulfill = function (result) {
            this.throwIfDisposed();
            if (result == this)
                throw new InvalidOperationException_1.InvalidOperationException("Cannot resolve a promise as itself.");
            if (this._state) {
                if (this._state == Promise.State.Fulfilled && this._result === result)
                    return;
                throw new InvalidOperationException_1.InvalidOperationException("Changing the fulfilled state/value of a promise is not supported.");
            }
            if (this._resolveCalled)
                throw new InvalidOperationException_1.InvalidOperationException(".resolve() already called.");
            this._state = Promise.State.Fulfilled;
            this._result = result;
            this._error = VOID0;
            var o = this._waiting;
            if (o) {
                this._waiting = VOID0;
                for (var _i = 0, o_1 = o; _i < o_1.length; _i++) {
                    var c = o_1[_i];
                    var onFulfilled = c.onFulfilled, promise = c.promise, p = promise;
                    PromiseCallbacks.recycle(c);
                    handleFulfill(p, result, onFulfilled);
                }
                o.length = 0;
            }
        };
        Pending.prototype.reject = function (error) {
            this.throwIfDisposed();
            if (this._state) {
                if (this._state == Promise.State.Rejected && this._error === error)
                    return;
                throw new InvalidOperationException_1.InvalidOperationException("Changing the rejected state/value of a promise is not supported.");
            }
            if (this._resolveCalled)
                throw new InvalidOperationException_1.InvalidOperationException(".resolve() already called.");
            this._state = Promise.State.Rejected;
            this._error = error;
            var o = this._waiting;
            if (o) {
                this._waiting = null;
                for (var _i = 0, o_2 = o; _i < o_2.length; _i++) {
                    var c = o_2[_i];
                    var onRejected = c.onRejected, promise = c.promise, p = promise;
                    PromiseCallbacks.recycle(c);
                    handleReject(p, error, onRejected);
                }
                o.length = 0;
            }
        };
        return Pending;
    }(Resolved));
    exports.Pending = Pending;
    var Deferred = (function (_super) {
        __extends(Deferred, _super);
        function Deferred(_source) {
            _super.call(this, VOID0);
            this._source = _source;
            if (!(_source instanceof Promise))
                throw new ArgumentException_1.ArgumentException(TARGET, "Must be of type Promise.");
        }
        Deferred.prototype._onDisposed = function () {
            _super.prototype._onDispose.call(this);
            this._source = VOID0;
        };
        Deferred.prototype.getState = function () {
            return this._source.state;
        };
        Deferred.prototype.getResult = function () {
            return this._source.result;
        };
        Deferred.prototype.getError = function () {
            return this._source.error;
        };
        Deferred.prototype.then = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            var d = this._source.defer();
            var p = d.then(onFulfilled, onRejected);
            d.finally(function () { return Pools.recycle(d); });
            return p;
        };
        Deferred.prototype.defer = function () {
            this.throwIfDisposed();
            return this;
        };
        Deferred.prototype.deferAll = function () {
            this.throwIfDisposed();
            return this;
        };
        return Deferred;
    }(Resolved));
    var Lazy = (function (_super) {
        __extends(Lazy, _super);
        function Lazy(_factory) {
            _super.call(this, Promise.State.Pending);
            this._factory = _factory;
        }
        Lazy.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this._factory = VOID0;
        };
        Lazy.prototype.getState = function () {
            this.getResult();
            return this._error;
        };
        Lazy.prototype.getResult = function () {
            if (!this._state) {
                try {
                    this._result = this._factory();
                    this._state = Promise.State.Fulfilled;
                }
                catch (ex) {
                    this._error = ex;
                    this._state = Promise.State.Rejected;
                }
                this._factory = VOID0;
            }
            return this._result;
        };
        Lazy.prototype.getError = function () {
            this.getResult();
            return this._error;
        };
        Lazy.prototype.then = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            this.getResult();
            return _super.prototype.then.call(this, onFulfilled, onRejected);
        };
        return Lazy;
    }(Resolved));
    var Pools;
    (function (Pools) {
        var PendingPool;
        (function (PendingPool) {
            var pool;
            function getPool() {
                return pool || (pool = new ObjectPool_1.ObjectPool(40, factory));
            }
            function factory() {
                return new Pending();
            }
            function get() {
                var p = getPool().take();
                p.__wasDisposed = false;
                p._state = Promise.State.Pending;
                return p;
            }
            PendingPool.get = get;
            function recycle(c) {
                c.dispose();
                getPool().add(c);
            }
            PendingPool.recycle = recycle;
        })(PendingPool = Pools.PendingPool || (Pools.PendingPool = {}));
        function recycle(c) {
            if (c instanceof Pending)
                PendingPool.recycle(c);
            else
                c.dispose();
        }
        Pools.recycle = recycle;
    })(Pools || (Pools = {}));
    var Promise;
    (function (Promise) {
        (function (State) {
            State[State["Pending"] = 0] = "Pending";
            State[State["Fulfilled"] = 1] = "Fulfilled";
            State[State["Rejected"] = -1] = "Rejected";
        })(Promise.State || (Promise.State = {}));
        var State = Promise.State;
        Object.freeze(State);
        function resolve(value) {
            return new Fulfilled(value);
        }
        Promise.resolve = resolve;
        function reject(reason) {
            return new Rejected(reason);
        }
        Promise.reject = reject;
        function lazy(factory) {
            return new Lazy(factory);
        }
        Promise.lazy = lazy;
        function wrap(target) {
            return target instanceof Promise ? this : new PromiseWrapper(target);
        }
        Promise.wrap = wrap;
        function createFrom(then) {
            return new PromiseWrapper({ then: then });
        }
        Promise.createFrom = createFrom;
        function pending(resolver) {
            var p = Pools.PendingPool.get();
            if (resolver)
                p.resolve(resolver);
            return p;
        }
        Promise.pending = pending;
    })(Promise = exports.Promise || (exports.Promise = {}));
    var PromiseCallbacks;
    (function (PromiseCallbacks) {
        var pool;
        function getPool() {
            return pool || (pool = new ObjectPool_1.ObjectPool(40, factory));
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
        function release(to, c) {
            var onFulfilled = c.onFulfilled, onRejected = c.onRejected;
            recycle(c);
            to.then(onFulfilled, onRejected);
        }
        PromiseCallbacks.release = release;
        function recycle(c) {
            c.onFulfilled = null;
            c.onRejected = null;
            c.promise = null;
            getPool().add(c);
        }
        PromiseCallbacks.recycle = recycle;
    })(PromiseCallbacks || (PromiseCallbacks = {}));
});
//# sourceMappingURL=Promise.js.map