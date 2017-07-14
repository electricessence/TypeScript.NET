/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Originally based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/parallel.js
 */
System.register(["../../Promises/Promise", "../../Types", "../Worker", "../deferImmediate", "../../Environment", "../../Disposable/ObjectPool", "../../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function extend(from, to) {
        if (!to)
            to = {};
        for (var _i = 0, _a = Object.keys(from); _i < _a.length; _i++) {
            var i = _a[_i];
            if (to[i] === VOID0)
                to[i] = from[i];
        }
        return to;
    }
    function interact(w, onMessage, onError, message) {
        if (onMessage)
            w.onmessage = onMessage;
        if (onError)
            w.onerror = onError;
        if (message !== VOID0)
            w.postMessage(message);
    }
    var Promise_1, Types_1, Worker_1, deferImmediate_1, Environment_1, ObjectPool_1, extends_1, __extends, MAX_WORKERS, VOID0, URL, _supports, defaults, WorkerPromise, workers, Parallel;
    return {
        setters: [
            function (Promise_1_1) {
                Promise_1 = Promise_1_1;
            },
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (Worker_1_1) {
                Worker_1 = Worker_1_1;
            },
            function (deferImmediate_1_1) {
                deferImmediate_1 = deferImmediate_1_1;
            },
            function (Environment_1_1) {
                Environment_1 = Environment_1_1;
            },
            function (ObjectPool_1_1) {
                ObjectPool_1 = ObjectPool_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             * Originally based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/parallel.js
             */
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            //noinspection JSUnusedAssignment
            MAX_WORKERS = 16, VOID0 = void 0, URL = typeof self !== Types_1.Type.UNDEFINED
                ? (self.URL ? self.URL : self.webkitURL)
                : null, _supports = Environment_1.isNodeJS || !!self.Worker; // node always supports parallel
            //noinspection JSUnusedAssignment
            defaults = {
                evalPath: Environment_1.isNodeJS ? __dirname + '/eval.js' : VOID0,
                maxConcurrency: Environment_1.isNodeJS
                    ? require('os').cpus().length
                    : (navigator.hardwareConcurrency || 4),
                allowSynchronous: true,
                env: {},
                envNamespace: 'env'
            };
            WorkerPromise = (function (_super) {
                __extends(WorkerPromise, _super);
                function WorkerPromise(worker, data) {
                    return _super.call(this, function (resolve, reject) {
                        interact(worker, function (response) {
                            resolve(response.data);
                        }, function (e) {
                            reject(e);
                        }, data);
                    }, true) || this;
                }
                return WorkerPromise;
            }(Promise_1.TSDNPromise));
            (function (workers) {
                /*
                 * Note:
                 * Currently there is nothing preventing excessive numbers of workers from being generated.
                 * Eventually there will be a master pool count which will regulate these workers.
                 */
                function getPool(key) {
                    var pool = workerPools[key];
                    if (!pool) {
                        workerPools[key] = pool = new ObjectPool_1.ObjectPool(8);
                        pool.autoClearTimeout = 3000; // Fast cleanup... 1s.
                    }
                    return pool;
                }
                var workerPools = {};
                function recycle(w) {
                    if (w) {
                        w.onerror = null;
                        w.onmessage = null;
                        var k = w.__key;
                        if (k) {
                            getPool(k).add(w);
                        }
                        else {
                            deferImmediate_1.deferImmediate(function () { return w.terminate(); });
                        }
                    }
                    return null;
                }
                workers.recycle = recycle;
                function tryGet(key) {
                    return getPool(key).tryTake();
                }
                workers.tryGet = tryGet;
                function getNew(key, url) {
                    var worker = new Worker_1.default(url);
                    worker.__key = key;
                    if (!worker.dispose) {
                        worker.dispose = function () {
                            worker.onmessage = null;
                            worker.onerror = null;
                            worker.dispose = null;
                            worker.terminate();
                        };
                    }
                    return worker;
                }
                workers.getNew = getNew;
            })(workers || (workers = {}));
            Parallel = (function () {
                function Parallel(options) {
                    this.options = extend(defaults, options);
                    this._requiredScripts = [];
                    this._requiredFunctions = [];
                    this.ensureClampedMaxConcurrency();
                }
                Parallel.maxConcurrency = function (max) {
                    return new Parallel({ maxConcurrency: max });
                };
                Parallel.prototype._getWorkerSource = function (task, env) {
                    var scripts = this._requiredScripts, functions = this._requiredFunctions;
                    var preStr = '';
                    if (!Environment_1.isNodeJS && scripts.length) {
                        preStr += 'importScripts("' + scripts.join('","') + '");\r\n';
                    }
                    for (var _i = 0, functions_1 = functions; _i < functions_1.length; _i++) {
                        var _a = functions_1[_i], name_1 = _a.name, fn = _a.fn;
                        var source = fn.toString();
                        preStr += name_1
                            ? "var " + name_1 + " = " + source + ";"
                            : source;
                    }
                    env = JSON.stringify(env || {});
                    var ns = this.options.envNamespace;
                    return preStr + (Environment_1.isNodeJS
                        ? "process.on(\"message\", function(e) {global." + ns + " = " + env + ";process.send(JSON.stringify((" + task.toString() + ")(JSON.parse(e).data)))})"
                        : "self.onmessage = function(e) {var global = {}; global." + ns + " = " + env + ";self.postMessage((" + task.toString() + ")(e.data))}");
                };
                Parallel.prototype.require = function () {
                    var required = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        required[_i] = arguments[_i];
                    }
                    return this.requireThese(required);
                };
                Parallel.prototype.requireThese = function (required) {
                    for (var _i = 0, required_1 = required; _i < required_1.length; _i++) {
                        var a = required_1[_i];
                        switch (typeof a) {
                            case Types_1.Type.STRING:
                                this._requiredScripts.push(a);
                                break;
                            case Types_1.Type.FUNCTION:
                                this._requiredFunctions.push({ fn: a });
                                break;
                            case Types_1.Type.OBJECT:
                                this._requiredFunctions.push(a);
                                break;
                            default:
                                throw new TypeError("Invalid type.");
                        }
                    }
                    return this;
                };
                Parallel.prototype._spawnWorker = function (task, env) {
                    var src = this._getWorkerSource(task, env);
                    if (Worker_1.default === VOID0)
                        return VOID0;
                    var worker = workers.tryGet(src);
                    if (worker)
                        return worker;
                    var scripts = this._requiredScripts;
                    var evalPath = this.options.evalPath;
                    if (!evalPath) {
                        if (Environment_1.isNodeJS)
                            throw new Error("Can't use NodeJS without eval.js!");
                        if (scripts.length)
                            throw new Error("Can't use required scripts without eval.js!");
                        if (!URL)
                            throw new Error("Can't create a blob URL in this browser!");
                    }
                    if (Environment_1.isNodeJS || scripts.length || !URL) {
                        worker = workers.getNew(src, evalPath);
                        worker.postMessage(src);
                    }
                    else if (URL) {
                        var blob = new Blob([src], { type: 'text/javascript' });
                        var url = URL.createObjectURL(blob);
                        worker = workers.getNew(src, url);
                    }
                    return worker;
                };
                /**
                 * Schedules the task to be run in the worker pool.
                 * @param data
                 * @param task
                 * @param env
                 * @returns {TSDNPromise<U>|TSDNPromise}
                 */
                Parallel.prototype.startNew = function (data, task, env) {
                    var _ = this;
                    var maxConcurrency = this.ensureClampedMaxConcurrency();
                    var worker = maxConcurrency ? _._spawnWorker(task, extend(_.options.env, env || {})) : null;
                    if (worker) {
                        return new WorkerPromise(worker, data)
                            .finallyThis(function () { return workers.recycle(worker); });
                    }
                    if (_.options.allowSynchronous)
                        return this.startLocal(data, task);
                    throw new Error(maxConcurrency
                        ? "Workers do not exist and synchronous operation not allowed!"
                        : "'maxConcurrency' set to 0 but 'allowSynchronous' is false.");
                };
                /**
                 * Runs the task within the local thread/process.
                 * Is good for use with testing.
                 * @param data
                 * @param task
                 * @returns {TSDNPromise<U>|TSDNPromise}
                 */
                Parallel.prototype.startLocal = function (data, task) {
                    return new Promise_1.TSDNPromise(function (resolve, reject) {
                        try {
                            resolve(task(data));
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                };
                /**
                 * Returns an array of promises that each resolve after their task completes.
                 * Provides a potential performance benefit by not waiting for all promises to resolve before proceeding to next step.
                 * @param data
                 * @param task
                 * @param env
                 * @returns {PromiseCollection}
                 */
                Parallel.prototype.pipe = function (data, task, env) {
                    // The resultant promise collection will make an internal copy...
                    var result;
                    if (data && data.length) {
                        var len_1 = data.length;
                        var taskString = task.toString();
                        var maxConcurrency = this.ensureClampedMaxConcurrency();
                        var error_1;
                        var i_1 = 0;
                        var _loop_1 = function (w) {
                            var worker = maxConcurrency ? this_1._spawnWorker(taskString, env) : null;
                            if (!worker) {
                                if (!this_1.options.allowSynchronous)
                                    throw new Error(maxConcurrency
                                        ? "Workers do not exist and synchronous operation not allowed!"
                                        : "'maxConcurrency' set to 0 but 'allowSynchronous' is false.");
                                return { value: Promise_1.TSDNPromise.map(data, task) };
                            }
                            if (!result) {
                                // There is a small risk that the consumer could call .resolve() which would result in a double resolution.
                                // But it's important to minimize the number of objects created.
                                result = data.map(function (d) { return new Promise_1.TSDNPromise(); });
                            }
                            var next = function () {
                                if (error_1) {
                                    worker = workers.recycle(worker);
                                }
                                if (worker) {
                                    if (i_1 < len_1) {
                                        //noinspection JSReferencingMutableVariableFromClosure
                                        var ii = i_1++, p_1 = result[ii];
                                        var wp_1 = new WorkerPromise(worker, data[ii]);
                                        //noinspection JSIgnoredPromiseFromCall
                                        wp_1.thenSynchronous(function (r) {
                                            //noinspection JSIgnoredPromiseFromCall
                                            p_1.resolve(r);
                                            next();
                                        }, function (e) {
                                            if (!error_1) {
                                                error_1 = e;
                                                //noinspection JSIgnoredPromiseFromCall
                                                p_1.reject(e);
                                                worker = workers.recycle(worker);
                                            }
                                        })
                                            .finallyThis(function () {
                                            return wp_1.dispose();
                                        });
                                    }
                                    else {
                                        worker = workers.recycle(worker);
                                    }
                                }
                            };
                            next();
                        };
                        var this_1 = this;
                        for (var w = 0; !error_1 && i_1 < Math.min(len_1, maxConcurrency); w++) {
                            var state_1 = _loop_1(w);
                            if (typeof state_1 === "object")
                                return state_1.value;
                        }
                    }
                    return new Promise_1.PromiseCollection(result);
                };
                Parallel.prototype.ensureClampedMaxConcurrency = function () {
                    var maxConcurrency = this.options.maxConcurrency;
                    if (maxConcurrency && maxConcurrency > MAX_WORKERS) {
                        this.options.maxConcurrency = maxConcurrency = MAX_WORKERS;
                        console.warn("More than " + MAX_WORKERS + " workers can reach worker limits and cause unexpected results.  maxConcurrency reduced to " + MAX_WORKERS + ".");
                    }
                    return (maxConcurrency || maxConcurrency === 0) ? maxConcurrency : MAX_WORKERS;
                };
                /**
                 * Waits for all tasks to resolve and returns a promise with the results.
                 * @param data
                 * @param task
                 * @param env
                 * @returns {ArrayPromise}
                 */
                Parallel.prototype.map = function (data, task, env) {
                    var _this = this;
                    if (!data || !data.length)
                        return Promise_1.ArrayPromise.fulfilled(data && []);
                    // Would return the same result, but has extra overhead.
                    // return this.pipe(data,task).all();
                    data = data.slice(); // Never use the original.
                    return new Promise_1.ArrayPromise(function (resolve, reject) {
                        var result = [], len = data.length;
                        result.length = len;
                        var taskString = task.toString();
                        var maxConcurrency = _this.ensureClampedMaxConcurrency(), error;
                        var i = 0, resolved = 0;
                        var _loop_2 = function (w) {
                            var worker = _this._spawnWorker(taskString, env);
                            if (!worker) {
                                if (!_this.options.allowSynchronous)
                                    throw new Error('Workers do not exist and synchronous operation not allowed!');
                                // Concurrency doesn't matter in a single thread... Just queue it all up.
                                resolve(Promise_1.TSDNPromise.map(data, task).all());
                                return { value: void 0 };
                            }
                            var next = function () {
                                if (error) {
                                    worker = workers.recycle(worker);
                                }
                                if (worker) {
                                    if (i < len) {
                                        var ii_1 = i++;
                                        var wp_2 = new WorkerPromise(worker, data[ii_1]);
                                        //noinspection JSIgnoredPromiseFromCall
                                        wp_2.thenSynchronous(function (r) {
                                            result[ii_1] = r;
                                            next();
                                        }, function (e) {
                                            if (!error) {
                                                error = e;
                                                reject(e);
                                                worker = workers.recycle(worker);
                                            }
                                        })
                                            .thenThis(function () {
                                            resolved++;
                                            if (resolved > len)
                                                throw Error("Resolved count exceeds data length.");
                                            if (resolved === len)
                                                resolve(result);
                                        })
                                            .finallyThis(function () {
                                            return wp_2.dispose();
                                        });
                                    }
                                    else {
                                        worker = workers.recycle(worker);
                                    }
                                }
                            };
                            next();
                        };
                        for (var w = 0; !error && i < Math.min(len, maxConcurrency); w++) {
                            var state_2 = _loop_2(w);
                            if (typeof state_2 === "object")
                                return state_2.value;
                        }
                    });
                };
                Object.defineProperty(Parallel, "isSupported", {
                    get: function () { return _supports; },
                    enumerable: true,
                    configurable: true
                });
                Parallel.options = function (options) {
                    return new Parallel(options);
                };
                Parallel.require = function () {
                    var required = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        required[_i] = arguments[_i];
                    }
                    return (new Parallel()).requireThese(required);
                };
                Parallel.requireThese = function (required) {
                    return (new Parallel()).requireThese(required);
                };
                Parallel.startNew = function (data, task, env) {
                    return (new Parallel()).startNew(data, task, env);
                };
                //
                // forEach<T>(data:T[], task:(data:T) => void, env?:any):PromiseBase<void>
                // {}
                Parallel.map = function (data, task, env) {
                    return (new Parallel()).map(data, task, env);
                };
                return Parallel;
            }());
            exports_1("Parallel", Parallel);
            exports_1("default", Parallel);
        }
    };
});
//# sourceMappingURL=Parallel.js.map