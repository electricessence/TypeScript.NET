function qFactory(nextTick, exceptionHandler) {
    var $qMinErr = minErr('$q', TypeError);
    var defer = function () {
        var d = new Deferred();
        d.resolve = simpleBind(d, d.resolve);
        d.reject = simpleBind(d, d.reject);
        d.notify = simpleBind(d, d.notify);
        return d;
    };
    function Promise() {
        this.$$state = { status: 0 };
    }
    extend(Promise.prototype, {
        then: function (onFulfilled, onRejected, progressBack) {
            if (isUndefined(onFulfilled) && isUndefined(onRejected) && isUndefined(progressBack)) {
                return this;
            }
            var result = new Deferred();
            this.$$state.pending = this.$$state.pending || [];
            this.$$state.pending.push([result, onFulfilled, onRejected, progressBack]);
            if (this.$$state.status > 0)
                scheduleProcessQueue(this.$$state);
            return result.promise;
        },
        "catch": function (callback) {
            return this.then(null, callback);
        },
        "finally": function (callback, progressBack) {
            return this.then(function (value) {
                return handleCallback(value, true, callback);
            }, function (error) {
                return handleCallback(error, false, callback);
            }, progressBack);
        }
    });
    function simpleBind(context, fn) {
        return function (value) {
            fn.call(context, value);
        };
    }
    function processQueue(state) {
        var fn, deferred, pending;
        pending = state.pending;
        state.processScheduled = false;
        state.pending = undefined;
        for (var i = 0, ii = pending.length; i < ii; ++i) {
            deferred = pending[i][0];
            fn = pending[i][state.status];
            try {
                if (isFunction(fn)) {
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
                exceptionHandler(e);
            }
        }
    }
    function scheduleProcessQueue(state) {
        if (state.processScheduled || !state.pending)
            return;
        state.processScheduled = true;
        nextTick(function () { processQueue(state); });
    }
    function Deferred() {
        this.promise = new Promise();
    }
    extend(Deferred.prototype, {
        resolve: function (val) {
            if (this.promise.$$state.status)
                return;
            if (val === this.promise) {
                this.$$reject($qMinErr('qcycle', "Expected promise to be resolved with value other than itself '{0}'", val));
            }
            else {
                this.$$resolve(val);
            }
        },
        $$resolve: function (val) {
            var then;
            var that = this;
            var done = false;
            try {
                if ((isObject(val) || isFunction(val)))
                    then = val && val.then;
                if (isFunction(then)) {
                    this.promise.$$state.status = -1;
                    then.call(val, resolvePromise, rejectPromise, simpleBind(this, this.notify));
                }
                else {
                    this.promise.$$state.value = val;
                    this.promise.$$state.status = 1;
                    scheduleProcessQueue(this.promise.$$state);
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
        },
        reject: function (reason) {
            if (this.promise.$$state.status)
                return;
            this.$$reject(reason);
        },
        $$reject: function (reason) {
            this.promise.$$state.value = reason;
            this.promise.$$state.status = 2;
            scheduleProcessQueue(this.promise.$$state);
        },
        notify: function (progress) {
            var callbacks = this.promise.$$state.pending;
            if ((this.promise.$$state.status <= 0) && callbacks && callbacks.length) {
                nextTick(function () {
                    var callback, result;
                    for (var i = 0, ii = callbacks.length; i < ii; i++) {
                        result = callbacks[i][0];
                        callback = callbacks[i][3];
                        try {
                            result.notify(isFunction(callback) ? callback(progress) : progress);
                        }
                        catch (e) {
                            exceptionHandler(e);
                        }
                    }
                });
            }
        }
    });
    var reject = function (reason) {
        var result = new Deferred();
        result.reject(reason);
        return result.promise;
    };
    var makePromise = function makePromise(value, resolved) {
        var result = new Deferred();
        if (resolved) {
            result.resolve(value);
        }
        else {
            result.reject(value);
        }
        return result.promise;
    };
    var handleCallback = function handleCallback(value, isResolved, callback) {
        var callbackOutput = null;
        try {
            if (isFunction(callback))
                callbackOutput = callback();
        }
        catch (e) {
            return makePromise(e, false);
        }
        if (isPromiseLike(callbackOutput)) {
            return callbackOutput.then(function () {
                return makePromise(value, isResolved);
            }, function (error) {
                return makePromise(error, false);
            });
        }
        else {
            return makePromise(value, isResolved);
        }
    };
    var when = function (value, callback, errback, progressBack) {
        var result = new Deferred();
        result.resolve(value);
        return result.promise.then(callback, errback, progressBack);
    };
    var resolve = when;
    function all(promises) {
        var deferred = new Deferred(), counter = 0, results = isArray(promises) ? [] : {};
        forEach(promises, function (promise, key) {
            counter++;
            when(promise).then(function (value) {
                if (results.hasOwnProperty(key))
                    return;
                results[key] = value;
                if (!(--counter))
                    deferred.resolve(results);
            }, function (reason) {
                if (results.hasOwnProperty(key))
                    return;
                deferred.reject(reason);
            });
        });
        if (counter === 0) {
            deferred.resolve(results);
        }
        return deferred.promise;
    }
    var $Q = function Q(resolver) {
        if (!isFunction(resolver)) {
            throw $qMinErr('norslvr', "Expected resolverFn, got '{0}'", resolver);
        }
        if (!(this instanceof Q)) {
            return new Q(resolver);
        }
        var deferred = new Deferred();
        function resolveFn(value) {
            deferred.resolve(value);
        }
        function rejectFn(reason) {
            deferred.reject(reason);
        }
        resolver(resolveFn, rejectFn);
        return deferred.promise;
    };
    $Q.defer = defer;
    $Q.reject = reject;
    $Q.when = when;
    $Q.resolve = resolve;
    $Q.all = all;
    return $Q;
}
//# sourceMappingURL=ngq.js.map