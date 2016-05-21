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
        define(["require", "exports", "../Types", "./Callbacks"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var PromiseCallbacks = require("./Callbacks");
    var VOID0 = void 0;
    function isPromise(value) {
        return Types_1.default.hasMemberOfType(value, "then", Types_1.default.FUNCTION);
    }
    var Resolved = (function () {
        function Resolved(_result, _error) {
            this._result = _result;
            this._error = _error;
        }
        Resolved.prototype.then = function (onFulfilled, onRejected) {
            try {
                var e = this._error;
                if (e !== VOID0) {
                    var rejection = onRejected ? onRejected(e) : e;
                    return rejection && isPromise(rejection)
                        ? rejection : rejected(rejection);
                }
                else {
                    var result = onFulfilled ? onFulfilled(this._result) : this._result;
                    return result && isPromise(result)
                        ? result : fulfilled(result);
                }
            }
            catch (ex) {
                return rejected(ex);
            }
        };
        Resolved.prototype['catch'] = function (onRejected) {
            return this.then(VOID0, onRejected);
        };
        Resolved.prototype['finally'] = function (fin) {
            return this.then(fin, fin);
        };
        return Resolved;
    }());
    exports.Resolved = Resolved;
    var Promise = (function (_super) {
        __extends(Promise, _super);
        function Promise() {
            _super.call(this, VOID0);
        }
        Promise.prototype.then = function (onFulfilled, onRejected) {
            var o = this._observers;
            if (o === VOID0)
                this._observers = o = [];
            if (!o)
                return _super.prototype.then.call(this, onFulfilled, onRejected);
            var p = new Promise();
            this._observers.push(PromiseCallbacks.init(onFulfilled, onRejected, p));
            return p;
        };
        Promise.prototype.fulfill = function (result) {
            this._result = result;
            this._error = VOID0;
            var o = this._observers;
            if (o) {
                this._observers = null;
                for (var _i = 0, o_1 = o; _i < o_1.length; _i++) {
                    var c = o_1[_i];
                    var onFulfilled = c.onFulfilled, promise = c.promise, p = promise;
                    PromiseCallbacks.recycle(c);
                    try {
                        p.fulfill(onFulfilled ? onFulfilled(result) : result);
                    }
                    catch (ex) {
                        p.reject(ex);
                    }
                }
                o.length = 0;
            }
        };
        Promise.prototype.reject = function (error) {
            this._error = error;
            var o = this._observers;
            if (o) {
                this._observers = null;
                for (var _i = 0, o_2 = o; _i < o_2.length; _i++) {
                    var c = o_2[_i];
                    var onRejected = c.onRejected, promise = c.promise, p = promise;
                    PromiseCallbacks.recycle(c);
                    try {
                        p.reject(onRejected ? onRejected(error) : error);
                    }
                    catch (ex) {
                        p.reject(ex);
                    }
                }
                o.length = 0;
            }
        };
        return Promise;
    }(Resolved));
    exports.Promise = Promise;
    function fulfilled(value) {
        return new Resolved(value);
    }
    exports.fulfilled = fulfilled;
    function rejected(error) {
        return new Resolved(VOID0, error);
    }
    exports.rejected = rejected;
});
//# sourceMappingURL=Simple.js.map