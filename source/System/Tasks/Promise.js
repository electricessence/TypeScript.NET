var PromiseState;
(function (PromiseState) {
    PromiseState[PromiseState["Pending"] = 0] = "Pending";
    PromiseState[PromiseState["Fulfilled"] = 1] = "Fulfilled";
    PromiseState[PromiseState["Rejected"] = 2] = "Rejected";
    PromiseState[PromiseState["Unknown"] = 3] = "Unknown";
})(PromiseState || (PromiseState = {}));
var VOID0 = void 0;
var Promise = (function () {
    function Promise(descriptor, fallback, inspect) {
        this.inspect = inspect;
        if (fallback === VOID0) {
            fallback = function (op) {
                return reject(new Error("Promise does not support operation: " + op));
            };
        }
        if (inspect === VOID0) {
            inspect = function () {
                return { state: "unknown" };
            };
        }
        var promise = Object.create(Promise.prototype);
        promise.promiseDispatch = function (resolve, op, args) {
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
        promise.inspect = inspect;
        if (inspect) {
            var inspected = inspect();
            if (inspected.state === "rejected") {
                promise.exception = inspected.reason;
            }
            promise.valueOf = function () {
                var inspected = inspect();
                if (inspected.state === "pending" ||
                    inspected.state === "rejected") {
                    return promise;
                }
                return inspected.value;
            };
        }
        return promise;
    }
    Promise.prototype.toString = function () {
        return "[object Promise]";
    };
    Promise.prototype.then = function (fulfilled, rejected, progressed) {
        var self = this;
        var deferred = defer();
        var done = false;
        function _fulfilled(value) {
            try {
                return typeof fulfilled === "function" ? fulfilled(value) : value;
            }
            catch (exception) {
                return reject(exception);
            }
        }
        function _rejected(exception) {
            if (typeof rejected === "function") {
                makeStackTraceLong(exception, self);
                try {
                    return rejected(exception);
                }
                catch (newException) {
                    return reject(newException);
                }
            }
            return reject(exception);
        }
        function _progressed(value) {
            return typeof progressed === "function" ? progressed(value) : value;
        }
        Q.nextTick(function () {
            self.promiseDispatch(function (value) {
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
        self.promiseDispatch(void 0, "when", [
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
    Promise.prototype.tap = function (callback) {
        callback = Q(callback);
        return this.then(function (value) {
            return callback.fcall(value).thenResolve(value);
        });
    };
    Promise.prototype.thenResolve = function (value) {
        return this.then(function () { return value; });
    };
    Promise.prototype.thenReject = function (reason) {
        return this.then(function () { throw reason; });
    };
    Promise.prototype.isPending = function () {
        return this.inspect().state === "pending";
    };
    Promise.prototype.isFulfilled = function () {
        return this.inspect().state === "fulfilled";
    };
    Promise.prototype.isRejected = function () {
        return this.inspect().state === "rejected";
    };
    return Promise;
})();
//# sourceMappingURL=Promise.js.map