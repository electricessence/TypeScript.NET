///<reference path="PromiseState.d.ts"/>
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './TaskManager'], function (require, exports) {
    var TaskManager_1 = require('./TaskManager');
    var Promise = (function () {
        function Promise() {
        }
        Promise.prototype.promiseDispatch = function (resolve, op, operands) {
            var args = array_slice(arguments);
            if (messages) {
                messages.push(args);
                if (op === "when" && operands[1]) {
                    progressListeners.push(operands[1]);
                }
            }
            else {
                TaskManager_1.default.defer(function () {
                    resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
                });
            }
        };
        Promise.prototype.valueOf = function () {
            if (messages) {
                return promise;
            }
            var nearerValue = nearer(resolvedPromise);
            if (isPromise(nearerValue)) {
                resolvedPromise = nearerValue;
            }
            return nearerValue;
        };
        Promise.prototype.inspect = function () {
            if (!resolvedPromise) {
                return { state: PromiseState.Pending };
            }
            return resolvedPromise.inspect();
        };
        return Promise;
    })();
    var Deferred = (function () {
        function Deferred() {
        }
        return Deferred;
    })();
    function defer() {
        /*
            if "messages" is an "Array", that indicates that the promise has not yet
             been resolved.  If it is "undefined", it has been resolved.  Each
             element of the messages array is itself an array of complete arguments to
             forward to the resolved promise.  We coerce the resolution value to a
             promise using the `resolve` function because it handles both fully
             non-thenable values and other thenables gracefully.*/
        var messages = [], progressListeners = [], resolvedPromise;
        var deferred = Object.create(defer.prototype);
        var promise = Object.create(Promise.prototype);
        promise.promiseDispatch = function (resolve, op, operands) {
            var args = array_slice(arguments);
            if (messages) {
                messages.push(args);
                if (op === "when" && operands[1]) {
                    progressListeners.push(operands[1]);
                }
            }
            else {
                TaskManager_1.default.defer(function () {
                    resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
                });
            }
        };
        promise.valueOf = function () {
            if (messages) {
                return promise;
            }
            var nearerValue = nearer(resolvedPromise);
            if (isPromise(nearerValue)) {
                resolvedPromise = nearerValue;
            }
            return nearerValue;
        };
        promise.inspect = function () {
            if (!resolvedPromise) {
                return { state: "pending" };
            }
            return resolvedPromise.inspect();
        };
        if (longStackSupport && hasStacks) {
            try {
                throw new Error();
            }
            catch (e) {
                promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
            }
        }
        function become(newPromise) {
            resolvedPromise = newPromise;
            promise.source = newPromise;
            array_reduce(messages, function (undefined, message) {
                TaskManager_1.default.defer(function () {
                    newPromise.promiseDispatch.apply(newPromise, message);
                });
            }, void 0);
            messages = void 0;
            progressListeners = void 0;
        }
        deferred.promise = promise;
        deferred.resolve = function (value) {
            if (resolvedPromise) {
                return;
            }
            become(Q(value));
        };
        deferred.fulfill = function (value) {
            if (resolvedPromise) {
                return;
            }
            become(fulfill(value));
        };
        deferred.reject = function (reason) {
            if (resolvedPromise) {
                return;
            }
            become(reject(reason));
        };
        deferred.notify = function (progress) {
            if (resolvedPromise) {
                return;
            }
            array_reduce(progressListeners, function (undefined, progressListener) {
                TaskManager_1.default.defer(function () {
                    progressListener(progress);
                });
            }, void 0);
        };
        return deferred;
    }
    defer.prototype.makeNodeResolver = function () {
        var self = this;
        return function (error, value) {
            if (error) {
                self.reject(error);
            }
            else if (arguments.length > 2) {
                self.resolve(array_slice(arguments, 1));
            }
            else {
                self.resolve(value);
            }
        };
    };
});
//# sourceMappingURL=Deferred.js.map