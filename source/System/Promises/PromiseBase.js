///<reference path="IPromise.d.ts"/>
///<reference path="IDeferred.d.ts"/>
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../Tasks/TaskManager'], function (require, exports) {
    var TaskManager_1 = require('../Tasks/TaskManager');
    var PromiseBase = (function () {
        function PromiseBase() {
        }
        PromiseBase.prototype.promiseDispatch = function (resolve, op, args) {
            var result;
            try {
                if (descriptor[op]) {
                    result = descriptor[op].apply(promise, args);
                }
                else {
                    result = fallback.call(promise, op, args);
                }
            }
            catch (exception) {
                result = reject(exception);
            }
            if (resolve) {
                resolve(result);
            }
        };
        PromiseBase.prototype.then = function (onFulfill, onReject) {
            var _ = this;
            var deferred = defer();
            var done = false;
            function _fulfilled(value) {
                try {
                    return typeof onFullfill === "function" ? onFullfill(value) : value;
                }
                catch (exception) {
                    return reject(exception);
                }
            }
            function _rejected(exception) {
                if (typeof rejected === "function") {
                    makeStackTraceLong(exception, _);
                    try {
                        return onReject(exception);
                    }
                    catch (newException) {
                        return reject(newException);
                    }
                }
                return reject(exception);
            }
            TaskManager_1.default.defer(function () {
                _.promiseDispatch(function (value) {
                    if (done) {
                        return;
                    }
                    done = true;
                    deferred.resolve(_fulfilled(value));
                }, "when", [
                    function (exception) {
                        if (done) {
                            return;
                        }
                        done = true;
                        deferred.resolve(_rejected(exception));
                    }
                ]);
            });
            _.promiseDispatch(void 0, "when", [
                void 0, function (value) {
                    var newValue;
                    var threw = false;
                    try {
                        newValue = _progressed(value);
                    }
                    catch (e) {
                        threw = true;
                        if (Q.onerror) {
                            Q.onerror(e);
                        }
                        else {
                            throw e;
                        }
                    }
                    if (!threw) {
                        deferred.notify(newValue);
                    }
                }
            ]);
            return deferred.promise;
        };
        return PromiseBase;
    })();
});
//# sourceMappingURL=PromiseBase.js.map