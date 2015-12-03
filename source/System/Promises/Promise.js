(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../Tasks/TaskManager', '../Types'], function (require, exports) {
    ///<reference path="IPromise.d.ts"/>
    ///<reference path="IDeferred.d.ts"/>
    var TaskManager_1 = require('../Tasks/TaskManager');
    var Types_1 = require('../Types');
    var VOID0 = void 0;
    var Promise = (function () {
        function Promise() {
        }
        Promise.prototype.then = function (onFulfill, onReject, onProgress) {
            var _ = this;
            if (onFulfill === VOID0 && onReject === VOID0 && onProgress === VOID0) {
                return _;
            }
            var result = new Deferred();
            var pending = _.__state.pending;
            if (!pending)
                pending = _.__state.pending || [];
            pending.push([result, onFulfill, onReject, onProgress]);
            if (_.__state.status > 0)
                scheduleProcessQueue(_.__state);
            return result.promise;
        };
        Promise.prototype['catch'] = function (onRejected) {
            return this.then(null, onRejected);
        };
        Promise.prototype['finally'] = function (finallyCallback, onProgress) {
            return this.then(function (value) { return handleCallback(value, true, finallyCallback); }, function (error) { return handleCallback(error, false, finallyCallback); }, onProgress);
        };
        return Promise;
    })();
    exports.Promise = Promise;
    var Deferred = (function () {
        function Deferred() {
            this.promise = new Promise();
        }
        Deferred.prototype.resolve = function (value) {
            var _ = this, p = _.promise;
            if (p.__state.status)
                return;
            if (value === p) {
                _._reject($qMinErr('qcycle', "Expected promise to be resolved with value other than itself '{0}'", val));
            }
            else {
                _._resolve(value);
            }
        };
        Deferred.prototype.reject = function (reason) {
            if (this.promise.__state.status)
                return;
            this.$$reject(reason);
        };
        Deferred.prototype._resolve = function (val) {
            var then;
            var that = this;
            var done = false;
            try {
                if ((isObject(val) || isFunction(val)))
                    then = val && val.then;
                if (isFunction(then)) {
                    this.promise.__state.status = -1;
                    then.call(val, resolvePromise, rejectPromise, simpleBind(this, this.notify));
                }
                else {
                    this.promise.__state.value = val;
                    this.promise.__state.status = 1;
                    scheduleProcessQueue(this.promise.__state);
                }
            }
            catch (e) {
                rejectPromise(e);
                exceptionHandler(e);
            }
            function resolvePromise(val) {
                if (done)
                    return;
                done = true;
                that.$$resolve(val);
            }
            function rejectPromise(val) {
                if (done)
                    return;
                done = true;
                that.$$reject(val);
            }
        };
        Deferred.prototype._reject = function (reason) {
            var state = this.promise.__state;
            state.value = reason;
            state.status = 2;
            scheduleProcessQueue(this.promise.__state);
        };
        Deferred.prototype.notify = function (progress) {
            var callbacks = this.promise.__state.pending;
            if ((this.promise.__state.status <= 0) && callbacks && callbacks.length) {
                TaskManager_1.default.defer(function () {
                    var callback, result;
                    for (var i = 0, ii = callbacks.length; i < ii; i++) {
                        result = callbacks[i][0];
                        callback = callbacks[i][3];
                        try {
                            result.notify(Types_1.default.isFunction(callback) ? callback(progress) : progress);
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                });
            }
        };
        return Deferred;
    })();
    exports.Deferred = Deferred;
    function simpleBind(context, fn) {
        return function (value) {
            fn.call(context, value);
        };
    }
    function processQueue(state) {
        var fn, deferred;
        var pending = state.pending;
        state.processScheduled = false;
        state.pending = undefined;
        for (var _i = 0; _i < pending.length; _i++) {
            var s = pending[_i];
            deferred = s[0];
            fn = s[state.status];
            try {
                if (Types_1.default.isFunction(fn)) {
                    deferred.resolve(fn(state.value));
                }
                else if (state.status === 1) {
                    deferred.resolve(state.value);
                }
                else {
                    deferred.reject(state.value);
                }
            }
            catch (e) {
                deferred.reject(e);
                console.error(e);
            }
        }
    }
    function scheduleProcessQueue(state) {
        if (state.processScheduled || !state.pending)
            return;
        state.processScheduled = true;
        TaskManager_1.default.defer(function () { processQueue(state); });
    }
});
//# sourceMappingURL=Promise.js.map