/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Although most of the following code is written from scratch, it is
 * heavily influenced by Q (https://github.com/kriskowal/q) and uses some of Q's spec.
 */
"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
var VOID0 = void 0,
    PROMISE = "Promise",
    PROMISE_STATE = PROMISE + "State",
    THEN = "then",
    TARGET = "target";
function isPromise(value) {
    return Types_1.default.hasMemberOfType(value, THEN, Types_1.default.FUNCTION);
}
function resolve(value, resolver, promiseFactory) {
    var nextValue = resolver ? resolver(value) : value;
    return nextValue && isPromise(nextValue) ? Promise.wrap(nextValue) : promiseFactory(nextValue);
}
function handleResolution(p, value, resolver) {
    try {
        var v = resolver ? resolver(value) : value;
        if (p) p.resolve(v);
    } catch (ex) {
        p.reject(ex);
    }
}
function handleResolutionMethods(targetFulfill, targetReject, value, resolver) {
    try {
        var v = resolver ? resolver(value) : value;
        if (targetFulfill) targetFulfill(v);
    } catch (ex) {
        if (targetReject) targetReject(ex);
    }
}
function handleDispatch(p, onFulfilled, onRejected) {
    if (p instanceof PromiseBase) p.thenThis(onFulfilled, onRejected);else p.then(onFulfilled, onRejected);
}
function newODE() {
    return new ObjectDisposedException_1.ObjectDisposedException("Promise", "An underlying promise-result was disposed.");
}

var PromiseState = function (_DisposableBase_1$Dis) {
    _inherits(PromiseState, _DisposableBase_1$Dis);

    function PromiseState(_state, _result, _error) {
        _classCallCheck(this, PromiseState);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PromiseState).call(this));

        _this._state = _state;
        _this._result = _result;
        _this._error = _error;
        _this._disposableObjectName = PROMISE_STATE;
        return _this;
    }

    _createClass(PromiseState, [{
        key: "_onDispose",
        value: function _onDispose() {
            this._state = VOID0;
            this._result = VOID0;
            this._error = VOID0;
        }
    }, {
        key: "getState",
        value: function getState() {
            return this._state;
        }
    }, {
        key: "getResult",
        value: function getResult() {
            return this._result;
        }
    }, {
        key: "getError",
        value: function getError() {
            return this._error;
        }
    }, {
        key: "state",
        get: function get() {
            return this._state;
        }
    }, {
        key: "isPending",
        get: function get() {
            return this.getState() === Promise.State.Pending;
        }
    }, {
        key: "isSettled",
        get: function get() {
            return this.getState() != Promise.State.Pending;
        }
    }, {
        key: "isFulfilled",
        get: function get() {
            return this.getState() === Promise.State.Fulfilled;
        }
    }, {
        key: "isRejected",
        get: function get() {
            return this.getState() === Promise.State.Rejected;
        }
    }, {
        key: "result",
        get: function get() {
            this.throwIfDisposed();
            return this.getResult();
        }
    }, {
        key: "error",
        get: function get() {
            this.throwIfDisposed();
            return this.getError();
        }
    }]);

    return PromiseState;
}(DisposableBase_1.DisposableBase);

exports.PromiseState = PromiseState;

var PromiseBase = function (_PromiseState) {
    _inherits(PromiseBase, _PromiseState);

    function PromiseBase() {
        _classCallCheck(this, PromiseBase);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(PromiseBase).call(this, Promise.State.Pending));

        _this2._disposableObjectName = PROMISE;
        return _this2;
    }

    _createClass(PromiseBase, [{
        key: "then",
        value: function then(onFulfilled, onRejected) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3.thenThis(function (result) {
                    return handleResolutionMethods(resolve, reject, result, onFulfilled);
                }, function (error) {
                    return onRejected ? handleResolutionMethods(resolve, null, error, onRejected) : reject(error);
                });
            });
        }
    }, {
        key: "done",
        value: function done(onFulfilled, onRejected) {
            var _this4 = this;

            defer_1.defer(function () {
                return _this4.thenThis(onFulfilled, onRejected);
            });
        }
    }, {
        key: "delayFromNow",
        value: function delayFromNow() {
            var _this5 = this;

            var milliseconds = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            this.throwIfDisposed();
            return new Promise(function (resolve, reject) {
                defer_1.defer(function () {
                    _this5.thenThis(function (v) {
                        return resolve(v);
                    }, function (e) {
                        return reject(e);
                    });
                }, milliseconds);
            }, true);
        }
    }, {
        key: "delayAfterResolve",
        value: function delayAfterResolve() {
            var _this6 = this;

            var milliseconds = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            this.throwIfDisposed();
            if (this.isSettled) return this.delayFromNow(milliseconds);
            return new Promise(function (resolve, reject) {
                _this6.thenThis(function (v) {
                    return defer_1.defer(function () {
                        return resolve(v);
                    }, milliseconds);
                }, function (e) {
                    return defer_1.defer(function () {
                        return reject(e);
                    }, milliseconds);
                });
            }, true);
        }
    }, {
        key: 'catch',
        value: function _catch(onRejected) {
            this.throwIfDisposed();
            return this.then(VOID0, onRejected);
        }
    }, {
        key: 'finally',
        value: function _finally(fin) {
            this.throwIfDisposed();
            return this.then(fin, fin);
        }
    }, {
        key: "finallyThis",
        value: function finallyThis(fin) {
            this.throwIfDisposed();
            var f = function f() {
                return deferImmediate_1.deferImmediate(fin);
            };
            this.thenThis(f, f);
            return this;
        }
    }]);

    return PromiseBase;
}(PromiseState);

exports.PromiseBase = PromiseBase;

var Resolvable = function (_PromiseBase) {
    _inherits(Resolvable, _PromiseBase);

    function Resolvable() {
        _classCallCheck(this, Resolvable);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Resolvable).apply(this, arguments));
    }

    _createClass(Resolvable, [{
        key: "thenSynchronous",
        value: function thenSynchronous(onFulfilled, onRejected) {
            this.throwIfDisposed();
            try {
                switch (this.state) {
                    case Promise.State.Fulfilled:
                        return onFulfilled ? resolve(this._result, onFulfilled, Promise.resolve) : this;
                    case Promise.State.Rejected:
                        return onRejected ? resolve(this._error, onRejected, Promise.resolve) : this;
                }
            } catch (ex) {
                return new Rejected(ex);
            }
            throw new Error("Invalid state for a resolved promise.");
        }
    }, {
        key: "thenThis",
        value: function thenThis(onFulfilled, onRejected) {
            this.throwIfDisposed();
            switch (this.state) {
                case Promise.State.Fulfilled:
                    if (onFulfilled) onFulfilled(this._result);
                    break;
                case Promise.State.Rejected:
                    if (onRejected) onRejected(this._error);
                    break;
            }
            return this;
        }
    }]);

    return Resolvable;
}(PromiseBase);

exports.Resolvable = Resolvable;

var Resolved = function (_Resolvable) {
    _inherits(Resolved, _Resolvable);

    function Resolved(state, result, error) {
        _classCallCheck(this, Resolved);

        var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(Resolved).call(this));

        _this8._result = result;
        _this8._error = error;
        _this8._state = state;
        return _this8;
    }

    return Resolved;
}(Resolvable);

exports.Resolved = Resolved;

var Fulfilled = function (_Resolved) {
    _inherits(Fulfilled, _Resolved);

    function Fulfilled(value) {
        _classCallCheck(this, Fulfilled);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Fulfilled).call(this, Promise.State.Fulfilled, value));
    }

    return Fulfilled;
}(Resolved);

var Rejected = function (_Resolved2) {
    _inherits(Rejected, _Resolved2);

    function Rejected(error) {
        _classCallCheck(this, Rejected);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Rejected).call(this, Promise.State.Rejected, VOID0, error));
    }

    return Rejected;
}(Resolved);

var PromiseWrapper = function (_Resolvable2) {
    _inherits(PromiseWrapper, _Resolvable2);

    function PromiseWrapper(_target) {
        _classCallCheck(this, PromiseWrapper);

        var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(PromiseWrapper).call(this));

        _this11._target = _target;
        if (!_target) throw new ArgumentNullException_1.ArgumentNullException(TARGET);
        if (!isPromise(_target)) throw new ArgumentException_1.ArgumentException(TARGET, "Must be a promise-like object.");
        _target.then(function (v) {
            _this11._state = Promise.State.Fulfilled;
            _this11._result = v;
            _this11._error = VOID0;
            _this11._target = VOID0;
        }, function (e) {
            _this11._state = Promise.State.Rejected;
            _this11._error = e;
            _this11._target = VOID0;
        });
        return _this11;
    }

    _createClass(PromiseWrapper, [{
        key: "thenSynchronous",
        value: function thenSynchronous(onFulfilled, onRejected) {
            this.throwIfDisposed();
            var t = this._target;
            if (!t) return _get(Object.getPrototypeOf(PromiseWrapper.prototype), "thenSynchronous", this).call(this, onFulfilled, onRejected);
            return new Promise(function (resolve, reject) {
                handleDispatch(t, function (result) {
                    return handleResolutionMethods(resolve, reject, result, onFulfilled);
                }, function (error) {
                    return onRejected ? handleResolutionMethods(resolve, null, error, onRejected) : reject(error);
                });
            }, true);
        }
    }, {
        key: "thenThis",
        value: function thenThis(onFulfilled, onRejected) {
            this.throwIfDisposed();
            var t = this._target;
            if (!t) return _get(Object.getPrototypeOf(PromiseWrapper.prototype), "thenThis", this).call(this, onFulfilled, onRejected);
            handleDispatch(t, onFulfilled, onRejected);
            return this;
        }
    }, {
        key: "_onDispose",
        value: function _onDispose() {
            _get(Object.getPrototypeOf(PromiseWrapper.prototype), "_onDispose", this).call(this);
            this._target = VOID0;
        }
    }]);

    return PromiseWrapper;
}(Resolvable);

var Promise = function (_Resolvable3) {
    _inherits(Promise, _Resolvable3);

    function Promise(resolver) {
        var forceSynchronous = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        _classCallCheck(this, Promise);

        var _this12 = _possibleConstructorReturn(this, Object.getPrototypeOf(Promise).call(this));

        if (resolver) _this12.resolveUsing(resolver, forceSynchronous);
        return _this12;
    }

    _createClass(Promise, [{
        key: "thenSynchronous",
        value: function thenSynchronous(onFulfilled, onRejected) {
            this.throwIfDisposed();
            if (this._state) return _get(Object.getPrototypeOf(Promise.prototype), "thenSynchronous", this).call(this, onFulfilled, onRejected);
            var p = new Promise();
            (this._waiting || (this._waiting = [])).push(pools.PromiseCallbacks.init(onFulfilled, onRejected, p));
            return p;
        }
    }, {
        key: "thenThis",
        value: function thenThis(onFulfilled, onRejected) {
            this.throwIfDisposed();
            if (this._state) return _get(Object.getPrototypeOf(Promise.prototype), "thenThis", this).call(this, onFulfilled, onRejected);
            (this._waiting || (this._waiting = [])).push(pools.PromiseCallbacks.init(onFulfilled, onRejected));
            return this;
        }
    }, {
        key: "_onDispose",
        value: function _onDispose() {
            _get(Object.getPrototypeOf(Promise.prototype), "_onDispose", this).call(this);
            this._resolvedCalled = VOID0;
        }
    }, {
        key: "resolveUsing",
        value: function resolveUsing(resolver) {
            var _this13 = this;

            var forceSynchronous = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var throwIfSettled = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            if (!resolver) throw new ArgumentNullException_1.ArgumentNullException("resolver");
            if (this._resolvedCalled) throw new InvalidOperationException_1.InvalidOperationException(".resolve() already called.");
            if (this.state) throw new InvalidOperationException_1.InvalidOperationException("Already resolved: " + Promise.State[this.state]);
            this._resolvedCalled = true;
            var state = 0;
            var rejectHandler = function rejectHandler(reason) {
                if (state) {
                    console.warn(state == -1 ? "Rejection called multiple times" : "Rejection called after fulfilled.");
                } else {
                    state = -1;
                    _this13._resolvedCalled = false;
                    _this13.reject(reason);
                }
            };
            var fulfillHandler = function fulfillHandler(v) {
                if (state) {
                    console.warn(state == 1 ? "Fulfill called multiple times" : "Fulfill called after rejection.");
                } else {
                    state = 1;
                    _this13._resolvedCalled = false;
                    _this13.resolve(v);
                }
            };
            if (forceSynchronous) resolver(fulfillHandler, rejectHandler);else deferImmediate_1.deferImmediate(function () {
                return resolver(fulfillHandler, rejectHandler);
            });
        }
    }, {
        key: "_emitDisposalRejection",
        value: function _emitDisposalRejection(p) {
            var d = p.wasDisposed;
            if (d) this._rejectInternal(newODE());
            return d;
        }
    }, {
        key: "_resolveInternal",
        value: function _resolveInternal(result) {
            var _this14 = this;

            if (this.wasDisposed) return;
            while (result instanceof PromiseBase) {
                var r = result;
                if (this._emitDisposalRejection(r)) return;
                switch (r.state) {
                    case Promise.State.Pending:
                        r.thenSynchronous(function (v) {
                            return _this14._resolveInternal(v);
                        }, function (e) {
                            return _this14._rejectInternal(e);
                        });
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
                result.then(function (v) {
                    return _this14._resolveInternal(v);
                }, function (e) {
                    return _this14._rejectInternal(e);
                });
            } else {
                this._state = Promise.State.Fulfilled;
                this._result = result;
                this._error = VOID0;
                var o = this._waiting;
                if (o) {
                    this._waiting = VOID0;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = o[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var c = _step.value;
                            var onFulfilled = c.onFulfilled;
                            var promise = c.promise;var p = promise;
                            pools.PromiseCallbacks.recycle(c);
                            handleResolution(p, result, onFulfilled);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    o.length = 0;
                }
            }
        }
    }, {
        key: "_rejectInternal",
        value: function _rejectInternal(error) {
            if (this.wasDisposed) return;
            this._state = Promise.State.Rejected;
            this._error = error;
            var o = this._waiting;
            if (o) {
                this._waiting = null;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = o[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var c = _step2.value;
                        var onRejected = c.onRejected;
                        var promise = c.promise;var p = promise;
                        pools.PromiseCallbacks.recycle(c);
                        if (onRejected) handleResolution(p, error, onRejected);else p.reject(error);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                o.length = 0;
            }
        }
    }, {
        key: "resolve",
        value: function resolve(result) {
            var throwIfSettled = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            this.throwIfDisposed();
            if (result == this) throw new InvalidOperationException_1.InvalidOperationException("Cannot resolve a promise as itself.");
            if (this._state) {
                if (!throwIfSettled || this._state == Promise.State.Fulfilled && this._result === result) return;
                throw new InvalidOperationException_1.InvalidOperationException("Changing the fulfilled state/value of a promise is not supported.");
            }
            if (this._resolvedCalled) {
                if (throwIfSettled) throw new InvalidOperationException_1.InvalidOperationException(".resolve() already called.");
                return;
            }
            this._resolveInternal(result);
        }
    }, {
        key: "reject",
        value: function reject(error) {
            var throwIfSettled = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            this.throwIfDisposed();
            if (this._state) {
                if (!throwIfSettled || this._state == Promise.State.Rejected && this._error === error) return;
                throw new InvalidOperationException_1.InvalidOperationException("Changing the rejected state/value of a promise is not supported.");
            }
            if (this._resolvedCalled) {
                if (throwIfSettled) throw new InvalidOperationException_1.InvalidOperationException(".resolve() already called.");
                return;
            }
            this._rejectInternal(error);
        }
    }]);

    return Promise;
}(Resolvable);

exports.Promise = Promise;
var pools;
(function (pools) {
    var PromiseCallbacks;
    (function (PromiseCallbacks) {
        var pool;
        function getPool() {
            return pool || (pool = new ObjectPool_1.ObjectPool(40, factory, function (c) {
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
(function (Promise) {
    (function (State) {
        State[State["Pending"] = 0] = "Pending";
        State[State["Fulfilled"] = 1] = "Fulfilled";
        State[State["Rejected"] = -1] = "Rejected";
    })(Promise.State || (Promise.State = {}));
    var State = Promise.State;
    Object.freeze(State);
    function all(first) {
        for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            rest[_key - 1] = arguments[_key];
        }

        if (!first && !rest.length) throw new ArgumentNullException_1.ArgumentNullException("promises");
        var promises = (Array.isArray(first) ? first : [first]).concat(rest);
        if (!promises.length || promises.every(function (v) {
            return !v;
        })) return new Fulfilled(promises);
        return new Promise(function (resolve, reject) {
            var checkedAll = false;
            var result = [];
            var len = promises.length;
            result.length = len;
            var remaining = new Set_1.Set(promises.map(function (v, i) {
                return i;
            }));
            var cleanup = function cleanup() {
                reject = null;
                resolve = null;
                promises.length = 0;
                promises = null;
                remaining.dispose();
                remaining = null;
            };
            var checkIfShouldResolve = function checkIfShouldResolve() {
                var r = resolve;
                if (r && !remaining.count) {
                    cleanup();
                    r(result);
                }
            };
            var onFulfill = function onFulfill(v, i) {
                if (resolve) {
                    result[i] = v;
                    remaining.remove(i);
                    checkIfShouldResolve();
                }
            };
            var onReject = function onReject(e) {
                var r = reject;
                if (r) {
                    cleanup();
                    r(e);
                }
            };

            var _loop = function _loop(i) {
                var p = promises[i];
                if (p) p.then(function (v) {
                    return onFulfill(v, i);
                }, onReject);else remaining.remove(i);
                checkIfShouldResolve();
            };

            for (var i = 0; remaining && i < len; i++) {
                _loop(i);
            }
        });
    }
    Promise.all = all;
    function waitAll(first) {
        for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            rest[_key2 - 1] = arguments[_key2];
        }

        if (!first && !rest.length) throw new ArgumentNullException_1.ArgumentNullException("promises");
        var promises = (Array.isArray(first) ? first : [first]).concat(rest);
        if (!promises.length || promises.every(function (v) {
            return !v;
        })) return new Fulfilled(promises);
        return new Promise(function (resolve, reject) {
            var checkedAll = false;
            var len = promises.length;
            var remaining = new Set_1.Set(promises.map(function (v, i) {
                return i;
            }));
            var cleanup = function cleanup() {
                reject = null;
                resolve = null;
                remaining.dispose();
                remaining = null;
            };
            var checkIfShouldResolve = function checkIfShouldResolve() {
                var r = resolve;
                if (r && !remaining.count) {
                    cleanup();
                    r(promises);
                }
            };
            var onResolved = function onResolved(i) {
                if (remaining) {
                    remaining.remove(i);
                    checkIfShouldResolve();
                }
            };

            var _loop2 = function _loop2(i) {
                var p = promises[i];
                if (p) p.then(function (v) {
                    return onResolved(i);
                }, function (e) {
                    return onResolved(i);
                });else onResolved(i);
            };

            for (var i = 0; remaining && i < len; i++) {
                _loop2(i);
            }
        });
    }
    Promise.waitAll = waitAll;
    function race(first) {
        for (var _len3 = arguments.length, rest = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            rest[_key3 - 1] = arguments[_key3];
        }

        var promises = first && (Array.isArray(first) ? first : [first]).concat(rest);
        if (!promises || !promises.length || !(promises = promises.filter(function (v) {
            return v != null;
        })).length) throw new ArgumentException_1.ArgumentException("Nothing to wait for.");
        var len = promises.length;
        if (len == 1) return wrap(promises[0]);
        for (var i = 0; i < len; i++) {
            var p = promises[i];
            if (p instanceof PromiseBase && p.isSettled) return p;
        }
        return new Promise(function (resolve, reject) {
            var cleanup = function cleanup() {
                reject = null;
                resolve = null;
                promises.length = 0;
                promises = null;
            };
            var onResolve = function onResolve(r, v) {
                if (r) {
                    cleanup();
                    r(v);
                }
            };
            var onFulfill = function onFulfill(v) {
                return onResolve(resolve, v);
            };
            var onReject = function onReject(e) {
                return onResolve(reject, e);
            };
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = promises[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _p = _step3.value;

                    if (!resolve) break;
                    _p.then(onFulfill, onReject);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
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
        if (!target) throw new ArgumentNullException_1.ArgumentNullException(TARGET);
        return target instanceof PromiseBase ? target : new PromiseWrapper(target);
    }
    Promise.wrap = wrap;
    function createFrom(then) {
        if (!then) throw new ArgumentNullException_1.ArgumentNullException(THEN);
        return new PromiseWrapper({ then: then });
    }
    Promise.createFrom = createFrom;
})(Promise = exports.Promise || (exports.Promise = {}));
//# sourceMappingURL=Promise.js.map
