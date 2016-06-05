/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
System.register(["./Promise", "../Threading/defer", "../Exceptions/ArgumentNullException", "../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Promise_1, defer_1, ArgumentNullException_1, extends_1;
    var __extends, VOID0, LazyPromise;
    return {
        setters:[
            function (Promise_1_1) {
                Promise_1 = Promise_1_1;
            },
            function (defer_1_1) {
                defer_1 = defer_1_1;
            },
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            VOID0 = void 0;
            LazyPromise = (function (_super) {
                __extends(LazyPromise, _super);
                function LazyPromise(_resolver) {
                    _super.call(this);
                    this._resolver = _resolver;
                    if (!_resolver)
                        throw new ArgumentNullException_1.ArgumentNullException("resolver");
                    this._resolvedCalled = true;
                }
                LazyPromise.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    this._resolver = VOID0;
                };
                LazyPromise.prototype._onThen = function () {
                    var r = this._resolver;
                    if (r) {
                        this._resolver = VOID0;
                        this._resolvedCalled = false;
                        this.resolveUsing(r);
                    }
                };
                LazyPromise.prototype.thenSynchronous = function (onFulfilled, onRejected) {
                    this._onThen();
                    return _super.prototype.thenSynchronous.call(this, onFulfilled, onRejected);
                };
                LazyPromise.prototype.thenThis = function (onFulfilled, onRejected) {
                    this._onThen();
                    return _super.prototype.thenThis.call(this, onFulfilled, onRejected);
                };
                LazyPromise.prototype.delayFromNow = function (milliseconds) {
                    var _this = this;
                    if (milliseconds === void 0) { milliseconds = 0; }
                    this.throwIfDisposed();
                    if (!this._resolver || this.isSettled)
                        return _super.prototype.delayFromNow.call(this, milliseconds);
                    var pass;
                    var timedOut = false;
                    var timeout = defer_1.defer(function () {
                        timedOut = true;
                        if (pass)
                            pass();
                    }, milliseconds);
                    return new LazyPromise(function (resolve, reject) {
                        pass = function () {
                            _this.thenThis(function (v) { return resolve(v); }, function (e) { return reject(e); });
                            timeout.dispose();
                            timeout = null;
                            pass = null;
                        };
                        if (timedOut)
                            pass();
                    });
                };
                LazyPromise.prototype.delayAfterResolve = function (milliseconds) {
                    var _this = this;
                    if (milliseconds === void 0) { milliseconds = 0; }
                    this.throwIfDisposed();
                    if (!this._resolver || this.isSettled)
                        return _super.prototype.delayAfterResolve.call(this, milliseconds);
                    var pass;
                    var timeout;
                    var finalize = function () {
                        if (timeout) {
                            timeout.dispose();
                            timeout = null;
                        }
                        if (pass)
                            pass();
                        finalize = null;
                    };
                    {
                        var detector = function () {
                            if (finalize)
                                timeout = defer_1.defer(finalize, milliseconds);
                        };
                        _super.prototype.thenThis.call(this, detector, detector);
                        detector = null;
                    }
                    return new LazyPromise(function (resolve, reject) {
                        if (_this.isPending) {
                            _this.thenThis(function (v) { return defer_1.defer(function () { return resolve(v); }, milliseconds); }, function (e) { return defer_1.defer(function () { return reject(e); }, milliseconds); });
                            finalize();
                        }
                        else {
                            pass = function () {
                                _this.thenThis(function (v) { return resolve(v); }, function (e) { return reject(e); });
                            };
                            if (!finalize)
                                pass();
                        }
                    });
                };
                return LazyPromise;
            }(Promise_1.Promise));
            exports_1("LazyPromise", LazyPromise);
            exports_1("default",LazyPromise);
        }
    }
});
//# sourceMappingURL=LazyPromise.js.map