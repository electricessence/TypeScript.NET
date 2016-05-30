/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
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
        define(["require", "exports", "./Promise", "../Threading/defer", "../Exceptions/ArgumentNullException"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Promise_1 = require("./Promise");
    var defer_1 = require("../Threading/defer");
    var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
    var VOID0 = void 0;
    var LazyPromise = (function (_super) {
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
    exports.LazyPromise = LazyPromise;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LazyPromise;
});
//# sourceMappingURL=LazyPromise.js.map