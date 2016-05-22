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
        define(["require", "exports", "../Types", "./Callbacks", "../Tasks/deferImmediate", "../Tasks/defer", "../Disposable/DisposableBase", "../Exceptions/InvalidOperationException"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var PromiseCallbacks = require("./Callbacks");
    var deferImmediate_1 = require("../Tasks/deferImmediate");
    var defer_1 = require("../Tasks/defer");
    var DisposableBase_1 = require("../Disposable/DisposableBase");
    var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
    var VOID0 = void 0, PROMISE = "Promise", THEN = "then";
    function isPromise(value) {
        return Types_1.default.hasMemberOfType(value, THEN, Types_1.default.FUNCTION);
    }
    function resolve(value, resolver, promiseFactory) {
        var nextValue = resolver
            ? resolver(value)
            : value;
        return nextValue && isPromise(nextValue)
            ? (nextValue instanceof Promise ? nextValue : new PromiseWrapper(nextValue))
            : promiseFactory(nextValue);
    }
    function handleFulfill(p, value, resolver) {
        try {
            p.resolve(resolver
                ? resolver(value)
                : value);
        }
        catch (ex) {
            p.reject(ex);
        }
    }
    function handleReject(p, error, resolver) {
        try {
            p.reject(resolver
                ? resolver(error)
                : error);
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
        Object.defineProperty(Promise.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Promise.prototype, "isPending", {
            get: function () {
                return this._state === Promise.State.Pending;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Promise.prototype, "isResolved", {
            get: function () {
                return this._state != Promise.State.Pending;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Promise.prototype, "isFulfilled", {
            get: function () {
                return this._state === Promise.State.Fulfilled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Promise.prototype, "isRejected", {
            get: function () {
                return this._state === Promise.State.Rejected;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Promise.prototype, "result", {
            get: function () {
                this.throwIfDisposed();
                return this._result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Promise.prototype, "error", {
            get: function () {
                this.throwIfDisposed();
                return this._error;
            },
            enumerable: true,
            configurable: true
        });
        Promise.prototype.defer = function () {
            this.throwIfDisposed();
            var p = new Pending();
            this.then(function (v) {
                deferImmediate_1.deferImmediate(function () { return p.resolve(v); });
                return p;
            }, function (e) {
                deferImmediate_1.deferImmediate(function () { return p.reject(e); });
                return p;
            });
            return p;
        };
        Promise.prototype.delay = function (milliseconds) {
            this.throwIfDisposed();
            var p = new Pending();
            this.then(function (v) {
                defer_1.defer(function () { return p.resolve(v); }, milliseconds);
                return p;
            }, function (e) {
                defer_1.defer(function () { return p.reject(e); }, milliseconds);
                return p;
            });
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
        function Pending() {
            _super.call(this, Promise.State.Pending);
        }
        Pending.prototype.then = function (onFulfilled, onRejected) {
            this.throwIfDisposed();
            var o = this._observers;
            if (o === VOID0)
                this._observers = o = [];
            if (!o)
                return _super.prototype.then.call(this, onFulfilled, onRejected);
            var p = new Pending();
            this._observers.push(PromiseCallbacks.init(onFulfilled, onRejected, p));
            return p;
        };
        Pending.prototype.resolve = function (result) {
            this.throwIfDisposed();
            if (this._state) {
                if (this._state == Promise.State.Fulfilled && this._result === result)
                    return;
                throw new InvalidOperationException_1.InvalidOperationException("Changing the fulfilled state/value of a promise is not supported.");
            }
            this._state = Promise.State.Fulfilled;
            this._result = result;
            this._error = VOID0;
            var o = this._observers;
            if (o) {
                this._observers = null;
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
            this._state = Promise.State.Rejected;
            this._error = error;
            var o = this._observers;
            if (o) {
                this._observers = null;
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
    var Promise;
    (function (Promise) {
        (function (State) {
            State[State["Pending"] = 0] = "Pending";
            State[State["Fulfilled"] = 1] = "Fulfilled";
            State[State["Rejected"] = 2] = "Rejected";
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
        function wrap(target) {
            return new PromiseWrapper(target);
        }
        Promise.wrap = wrap;
        function createFrom(then) {
            return new PromiseWrapper({ then: then });
        }
        Promise.createFrom = createFrom;
        function pending() {
            return new Pending();
        }
        Promise.pending = pending;
    })(Promise = exports.Promise || (exports.Promise = {}));
});
//# sourceMappingURL=Promise.js.map