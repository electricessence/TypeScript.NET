/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * The following code is heavily influenced by Q (https://github.com/kriskowal/q) and uses Q's spec.
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
        define(["require", "exports", "../Types", "../Disposable/ObjectPool", "../Exceptions/ArgumentNullException", "../Disposable/DisposableBase", "../Tasks/deferImmediate", "../Functions", "../Lazy", "./Callbacks"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var ObjectPool_1 = require("../Disposable/ObjectPool");
    var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
    var DisposableBase_1 = require("../Disposable/DisposableBase");
    var deferImmediate_1 = require("../Tasks/deferImmediate");
    var Functions_1 = require("../Functions");
    var Lazy_1 = require("../Lazy");
    var PromiseCallbacks = require("./Callbacks");
    var VOID0 = void 0;
    var deferPool;
    function deferFactory(recycle) {
        if (!deferPool)
            deferPool
                = new ObjectPool_1.ObjectPool(40, function () { return new Defer(); });
        if (!recycle)
            return deferPool.take();
        recycle.dispose();
        deferPool.add(recycle);
    }
    function defer() {
        return deferFactory();
    }
    exports.defer = defer;
    function isPromise(value) {
        return Types_1.default.hasMemberOfType(value, "then", Types_1.default.FUNCTION);
    }
    exports.isPromise = isPromise;
    function resolve(value) {
        if (isPromise(value))
            return value;
        return new FulfilledPromise(value);
    }
    function reject(err) {
        return new RejectedPromise(err);
    }
    var Defer = (function () {
        function Defer() {
        }
        Defer.prototype.dispose = function () {
            this._pending = VOID0;
            this._final = VOID0;
            this._promiseLazy = VOID0;
        };
        Defer.prototype.resolve = function (value) {
            var _ = this, p = _._pending;
            if (p === VOID0)
                _._pending = p = [];
            if (p) {
                var r = _._final = resolve(value);
                _._pending = null;
                var pl = _._promiseLazy, pe = pl && pl.isValueCreated && pl.value;
                if (pe instanceof PendingPromise)
                    pe._state = Promise.State.Fulfilled;
                for (var _i = 0, p_1 = p; _i < p_1.length; _i++) {
                    var c = p_1[_i];
                    PromiseCallbacks.release(r, c);
                }
                p.length = 0;
                p = null;
            }
        };
        Defer.prototype.reject = function (err) {
            var _ = this, p = _._pending;
            if (p === VOID0)
                _._pending = p = [];
            if (p) {
                var r = _._final = reject(err);
                _._pending = null;
                var pl = _._promiseLazy, pe = pl && pl.isValueCreated && pl.value;
                if (pe instanceof PendingPromise)
                    pe._state = Promise.State.Rejected;
                for (var _i = 0, p_2 = p; _i < p_2.length; _i++) {
                    var c = p_2[_i];
                    PromiseCallbacks.release(r, c);
                }
                p.length = 0;
                p = null;
            }
        };
        Object.defineProperty(Defer.prototype, "promise", {
            get: function () {
                return this.promiseLazy.value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Defer.prototype, "promiseLazy", {
            get: function () {
                var _ = this;
                var pr = _._promiseLazy;
                if (!pr)
                    _._promiseLazy = pr = new Lazy_1.Lazy(function () { return Defer._getPromise(_); });
                return pr;
            },
            enumerable: true,
            configurable: true
        });
        Defer._getPromise = function (d) {
            return d._final || new PendingPromise(function (onFulfilled, onRejected) {
                onFulfilled = onFulfilled || Functions_1.Functions.Identity;
                onRejected = onRejected || reject;
                var result = deferFactory();
                var f = function (v) { result.resolve(onFulfilled(v)); }, e = function (v) { result.resolve(onRejected(v)); };
                var pe = d._pending;
                if (pe === VOID0)
                    pe = d._pending = [];
                if (pe)
                    pe.push(PromiseCallbacks.init(f, e));
                else {
                    var r_1 = d._final;
                    deferImmediate_1.deferImmediate(function () { return r_1.then(f, e); });
                }
                return result.promise;
            });
        };
        return Defer;
    }());
    exports.Defer = Defer;
    var PromiseBase = (function (_super) {
        __extends(PromiseBase, _super);
        function PromiseBase(_result, _error, state) {
            _super.call(this);
            this._result = _result;
            this._error = _error;
            if (state === VOID0) {
                if (_error)
                    this._state = Promise.State.Rejected;
                if (_result !== VOID0)
                    this._state = Promise.State.Fulfilled;
            }
            else {
                this._state = state;
            }
        }
        PromiseBase.prototype._onDispose = function () {
            this._state = Promise.State.Disposed;
            this._result = VOID0;
            this._error = VOID0;
        };
        Object.defineProperty(PromiseBase.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PromiseBase.prototype, "isResolved", {
            get: function () {
                var s = this._state;
                return isFinite(s) && s > Promise.State.Pending;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PromiseBase.prototype, "isFulfilled", {
            get: function () {
                return this._state === Promise.State.Fulfilled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PromiseBase.prototype, "isRejected", {
            get: function () {
                return this._state === Promise.State.Rejected;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PromiseBase.prototype, "result", {
            get: function () {
                return this._result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PromiseBase.prototype, "error", {
            get: function () {
                return this._error;
            },
            enumerable: true,
            configurable: true
        });
        return PromiseBase;
    }(DisposableBase_1.DisposableBase));
    exports.PromiseBase = PromiseBase;
    var FulfilledPromise = (function (_super) {
        __extends(FulfilledPromise, _super);
        function FulfilledPromise(value) {
            _super.call(this, value, VOID0, Promise.State.Fulfilled);
        }
        FulfilledPromise.prototype.then = function (onFulfilled) {
            var _ = this;
            _.throwIfDisposed();
            if (!onFulfilled)
                onFulfilled = Functions_1.Functions.Identity;
            var result = deferFactory();
            var r = this._result;
            deferImmediate_1.deferImmediate(function () { return result.resolve(onFulfilled(r)); });
            return result.promise;
        };
        return FulfilledPromise;
    }(PromiseBase));
    exports.FulfilledPromise = FulfilledPromise;
    var RejectedPromise = (function (_super) {
        __extends(RejectedPromise, _super);
        function RejectedPromise(err) {
            _super.call(this, VOID0, err, Promise.State.Rejected);
        }
        RejectedPromise.prototype.then = function (onFulfilled, onRejected) {
            var _ = this;
            _.throwIfDisposed();
            if (!onRejected)
                onRejected = reject;
            var result = deferFactory();
            var e = this._error;
            deferImmediate_1.deferImmediate(function () { return result.resolve(onRejected(e)); });
            return result.promise;
        };
        return RejectedPromise;
    }(PromiseBase));
    exports.RejectedPromise = RejectedPromise;
    var PendingPromise = (function (_super) {
        __extends(PendingPromise, _super);
        function PendingPromise(_execute) {
            _super.call(this);
            this._execute = _execute;
            if (!_execute)
                throw new ArgumentNullException_1.ArgumentNullException('_execute');
            this._state = Promise.State.Pending;
        }
        PendingPromise.prototype.then = function (onFulfilled, onRejected) {
            return this._execute(onFulfilled, onRejected);
        };
        return PendingPromise;
    }(PromiseBase));
    var Promise = (function (_super) {
        __extends(Promise, _super);
        function Promise(_execute) {
            _super.call(this);
            this._execute = _execute;
            if (!_execute)
                throw new ArgumentNullException_1.ArgumentNullException('_execute');
            this._state = Promise.State.Ready;
        }
        Promise.prototype.reset = function () {
            this.throwIfDisposed();
            this._state = Promise.State.Ready;
        };
        Promise.prototype._getListeners = function () {
            this.throwIfDisposed();
            var l = this._listeners;
            if (!l)
                this._listeners = [];
            return l;
        };
        Promise.prototype._onDispose = function () {
            if (this._listeners) {
                this._listeners.length = 0;
                this._listeners = null;
            }
            _super.prototype._onDispose.call(this);
        };
        Promise.prototype.dispatch = function () {
        };
        Promise.prototype.ensure = function () {
            var _this = this;
            this.throwIfDisposed();
            if (this._state === Promise.State.Ready) {
                this._state = Promise.State.Pending;
                this._execute(function (value) { return _this._onResolve(value); }, function (reason) { return _this._onReject(reason); });
            }
            return this;
        };
        Promise.prototype._onResolve = function (value) {
            var l = this._listeners;
            this._listeners = null;
            this.state = Promise.State.Fulfilled;
            if (l)
                for (var _i = 0, l_1 = l; _i < l_1.length; _i++) {
                    var e = l_1[_i];
                }
            l.length = 0;
            this._onFinally();
        };
        Promise.prototype._onReject = function (reason) {
            var l = this._listeners;
            this._listeners = null;
            this.state = Promise.State.Rejected;
            if (l)
                for (var _i = 0, l_2 = l; _i < l_2.length; _i++) {
                    var e = l_2[_i];
                }
            l.length = 0;
            this._onFinally();
        };
        Promise.prototype._onFinally = function () {
        };
        Promise.prototype.then = function (onFulfilled, onRejected) {
            return null;
        };
        return Promise;
    }(PromiseBase));
    exports.Promise = Promise;
    var Promise;
    (function (Promise) {
        function fulfilled(value) {
            return new FulfilledPromise(value);
        }
        Promise.fulfilled = fulfilled;
        function rejected(err) {
            return new RejectedPromise(err);
        }
        Promise.rejected = rejected;
        (function (State) {
            State[State["Ready"] = -1] = "Ready";
            State[State["Pending"] = 0] = "Pending";
            State[State["Fulfilled"] = 1] = "Fulfilled";
            State[State["Rejected"] = 2] = "Rejected";
            State[State["Disposed"] = Infinity] = "Disposed";
        })(Promise.State || (Promise.State = {}));
        var State = Promise.State;
        Object.freeze(State);
    })(Promise = exports.Promise || (exports.Promise = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Promise;
});
//# sourceMappingURL=Promise.js.map