/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Originally based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/parallel.js
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Promise_1 = require("../../Promises/Promise");
var Types_1 = require("../../Types");
var Worker_1 = require("../Worker");
var deferImmediate_1 = require("../deferImmediate");
var Environment_1 = require("../../Environment");
var ObjectPool_1 = require("../../Disposable/ObjectPool");
var MAX_WORKERS = 16, VOID0 = void 0, URL = typeof self !== Types_1.Type.UNDEFINED ? (self.URL ? self.URL : self.webkitURL) : null, _supports = (Environment_1.isNodeJS || self.Worker) ? true : false;
var defaults = {
    evalPath: Environment_1.isNodeJS ? __dirname + '/eval.js' : null,
    maxConcurrency: Environment_1.isNodeJS ? require('os').cpus().length : (navigator.hardwareConcurrency || 4),
    allowSynchronous: true,
    env: {},
    envNamespace: 'env'
};
function extend(from, to) {
    if (!to)
        to = {};
    for (var _i = 0, _a = Object.keys(from); _i < _a.length; _i++) {
        var i = _a[_i];
        if (to[i] === void 0)
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
var WorkerPromise = (function (_super) {
    __extends(WorkerPromise, _super);
    function WorkerPromise(worker, data) {
        _super.call(this, function (resolve, reject) {
            interact(worker, function (response) {
                resolve(response.data);
            }, function (e) {
                reject(e);
            }, data);
        }, true);
    }
    return WorkerPromise;
}(Promise_1.Promise));
var workers;
(function (workers) {
    function getPool(key) {
        var pool = workerPools[key];
        if (!pool) {
            workerPools[key] = pool = new ObjectPool_1.ObjectPool(8);
            pool.autoClearTimeout = 3000;
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
        worker.dispose = function () {
            worker.onmessage = null;
            worker.onerror = null;
            worker.dispose = null;
            worker.terminate();
        };
        return worker;
    }
    workers.getNew = getNew;
})(workers || (workers = {}));
var Parallel = (function () {
    function Parallel(options) {
        this.options = extend(defaults, options);
        this._requiredScripts = [];
        this._requiredFunctions = [];
        this.ensureClampedMaxConcurrency();
    }
    Parallel.maxConcurrency = function (max) {
        return new Parallel({ maxConcurrency: max });
    };
    Parallel.prototype.getWorkerSource = function (task, env) {
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
            : "self.onmessage = function(e) {var global = {}; global." + ns + " = " + env + "';self.postMessage((" + task.toString() + ")(e.data))}");
    };
    Parallel.prototype.require = function () {
        var required = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            required[_i - 0] = arguments[_i];
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
        var src = this.getWorkerSource(task, env);
        if (Worker_1.default === VOID0)
            return VOID0;
        var worker = workers.tryGet(src);
        if (worker)
            return worker;
        var scripts = this._requiredScripts, evalPath = this.options.evalPath;
        if (!evalPath) {
            if (Environment_1.isNodeJS)
                throw new Error("Can't use NodeJD without eval.js!");
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
    Parallel.prototype.startNew = function (data, task, env) {
        var _ = this;
        var worker = _._spawnWorker(task, extend(_.options.env, env || {}));
        if (worker)
            return new WorkerPromise(worker, data)
                .finallyThis(function () { return workers.recycle(worker); });
        if (_.options.allowSynchronous)
            return new Promise_1.Promise(function (resolve, reject) {
                try {
                    resolve(task(data));
                }
                catch (e) {
                    reject(e);
                }
            });
        throw new Error('Workers do not exist and synchronous operation not allowed!');
    };
    Parallel.prototype.pipe = function (data, task, env) {
        var maxConcurrency = this.ensureClampedMaxConcurrency();
        return new Promise_1.PromiseCollection(data && data.map(function (d) { return new Promise_1.Promise(function (resolve, reject) {
        }); }));
    };
    Parallel.prototype.ensureClampedMaxConcurrency = function () {
        var maxConcurrency = this.options.maxConcurrency;
        if (maxConcurrency > MAX_WORKERS) {
            this.options.maxConcurrency = maxConcurrency = MAX_WORKERS;
            console.warn("More than " + MAX_WORKERS + " workers can reach worker limits and cause unexpected results.  maxConcurrency reduced to " + MAX_WORKERS + ".");
        }
        return maxConcurrency;
    };
    Parallel.prototype.map = function (data, task, env) {
        var _this = this;
        if (!data || !data.length)
            return Promise_1.ArrayPromise.fulfilled(data && []);
        data = data.slice();
        return new Promise_1.ArrayPromise(function (resolve, reject) {
            var result = [], len = data.length;
            result.length = len;
            var taskString = task.toString();
            var maxConcurrency = _this.ensureClampedMaxConcurrency(), error;
            var i = 0, resolved = 0;
            var _loop_1 = function(w) {
                var worker = _this._spawnWorker(taskString, env);
                if (!worker) {
                    if (!_this.options.allowSynchronous)
                        throw new Error('Workers do not exist and synchronous operation not allowed!');
                    resolve(Promise_1.Promise
                        .all(data.map(function (d) { return new Promise_1.Promise(function (r, j) {
                        try {
                            r(task(d));
                        }
                        catch (ex) {
                            j(ex);
                        }
                    }); })));
                    return { value: void 0 };
                }
                var next = function () {
                    if (error) {
                        worker = workers.recycle(worker);
                    }
                    if (worker) {
                        if (i < len) {
                            var ii_1 = i++;
                            var wp_1 = new WorkerPromise(worker, data[ii_1]);
                            wp_1
                                .thenSynchronous(function (r) {
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
            for (var w = 0; !error && i < Math.min(len, maxConcurrency); w++) {
                var state_1 = _loop_1(w);
                if (typeof state_1 === "object") return state_1.value;
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
            required[_i - 0] = arguments[_i];
        }
        return (new Parallel()).requireThese(required);
    };
    Parallel.requireThese = function (required) {
        return (new Parallel()).requireThese(required);
    };
    Parallel.startNew = function (data, task, env) {
        return (new Parallel()).startNew(data, task, env);
    };
    Parallel.map = function (data, task, env) {
        return (new Parallel()).map(data, task, env);
    };
    return Parallel;
}());
exports.Parallel = Parallel;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Parallel;
//# sourceMappingURL=Parallel.js.map