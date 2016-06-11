/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Originally based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/parallel.js
 */
import { Promise, ArrayPromise, PromiseCollection } from "../../Promises/Promise";
import { Type } from "../../Types";
import Worker from "../Worker";
import { deferImmediate } from "../deferImmediate";
import { isNodeJS } from "../../Environment";
import { ObjectPool } from "../../Disposable/ObjectPool";
const MAX_WORKERS = 16, VOID0 = void 0, URL = typeof self !== Type.UNDEFINED ? (self.URL ? self.URL : self.webkitURL) : null, _supports = (isNodeJS || self.Worker) ? true : false;
const defaults = {
    evalPath: isNodeJS ? __dirname + '/eval.js' : null,
    maxConcurrency: isNodeJS ? require('os').cpus().length : (navigator.hardwareConcurrency || 4),
    allowSynchronous: true,
    env: {},
    envNamespace: 'env'
};
function extend(from, to) {
    if (!to)
        to = {};
    for (var i of Object.keys(from)) {
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
class WorkerPromise extends Promise {
    constructor(worker, data) {
        super((resolve, reject) => {
            interact(worker, (response) => {
                resolve(response.data);
            }, (e) => {
                reject(e);
            }, data);
        }, true);
    }
}
var workers;
(function (workers) {
    function getPool(key) {
        var pool = workerPools[key];
        if (!pool) {
            workerPools[key] = pool = new ObjectPool(8);
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
                deferImmediate(() => w.terminate());
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
        var worker = new Worker(url);
        worker.__key = key;
        worker.dispose = () => {
            worker.onmessage = null;
            worker.onerror = null;
            worker.dispose = null;
            worker.terminate();
        };
        return worker;
    }
    workers.getNew = getNew;
})(workers || (workers = {}));
export class Parallel {
    constructor(options) {
        this.options = extend(defaults, options);
        this._requiredScripts = [];
        this._requiredFunctions = [];
        this.ensureClampedMaxConcurrency();
    }
    static maxConcurrency(max) {
        return new Parallel({ maxConcurrency: max });
    }
    getWorkerSource(task, env) {
        var scripts = this._requiredScripts, functions = this._requiredFunctions;
        var preStr = '';
        if (!isNodeJS && scripts.length) {
            preStr += 'importScripts("' + scripts.join('","') + '");\r\n';
        }
        for (let { name, fn } of functions) {
            var source = fn.toString();
            preStr += name
                ? `var ${name} = ${source};`
                : source;
        }
        env = JSON.stringify(env || {});
        const ns = this.options.envNamespace;
        return preStr + (isNodeJS
            ? `process.on("message", function(e) {global.${ns} = ${env};process.send(JSON.stringify((${task.toString()})(JSON.parse(e).data)))})`
            : `self.onmessage = function(e) {var global = {}; global.${ns} = ${env}';self.postMessage((${task.toString()})(e.data))}`);
    }
    require(...required) {
        return this.requireThese(required);
    }
    requireThese(required) {
        for (let a of required) {
            switch (typeof a) {
                case Type.STRING:
                    this._requiredScripts.push(a);
                    break;
                case Type.FUNCTION:
                    this._requiredFunctions.push({ fn: a });
                    break;
                case Type.OBJECT:
                    this._requiredFunctions.push(a);
                    break;
                default:
                    throw new TypeError("Invalid type.");
            }
        }
        return this;
    }
    _spawnWorker(task, env) {
        var src = this.getWorkerSource(task, env);
        if (Worker === VOID0)
            return VOID0;
        var worker = workers.tryGet(src);
        if (worker)
            return worker;
        var scripts = this._requiredScripts, evalPath = this.options.evalPath;
        if (!evalPath) {
            if (isNodeJS)
                throw new Error("Can't use NodeJD without eval.js!");
            if (scripts.length)
                throw new Error("Can't use required scripts without eval.js!");
            if (!URL)
                throw new Error("Can't create a blob URL in this browser!");
        }
        if (isNodeJS || scripts.length || !URL) {
            worker = workers.getNew(src, evalPath);
            worker.postMessage(src);
        }
        else if (URL) {
            var blob = new Blob([src], { type: 'text/javascript' });
            var url = URL.createObjectURL(blob);
            worker = workers.getNew(src, url);
        }
        return worker;
    }
    startNew(data, task, env) {
        const _ = this;
        let worker = _._spawnWorker(task, extend(_.options.env, env || {}));
        if (worker)
            return new WorkerPromise(worker, data)
                .finallyThis(() => workers.recycle(worker));
        if (_.options.allowSynchronous)
            return new Promise((resolve, reject) => {
                try {
                    resolve(task(data));
                }
                catch (e) {
                    reject(e);
                }
            });
        throw new Error('Workers do not exist and synchronous operation not allowed!');
    }
    pipe(data, task, env) {
        let maxConcurrency = this.ensureClampedMaxConcurrency();
        return new PromiseCollection(data && data.map(d => new Promise((resolve, reject) => {
        })));
    }
    ensureClampedMaxConcurrency() {
        let { maxConcurrency } = this.options;
        if (maxConcurrency > MAX_WORKERS) {
            this.options.maxConcurrency = maxConcurrency = MAX_WORKERS;
            console.warn(`More than ${MAX_WORKERS} workers can reach worker limits and cause unexpected results.  maxConcurrency reduced to ${MAX_WORKERS}.`);
        }
        return maxConcurrency;
    }
    map(data, task, env) {
        if (!data || !data.length)
            return ArrayPromise.fulfilled(data && []);
        data = data.slice();
        return new ArrayPromise((resolve, reject) => {
            const result = [], len = data.length;
            result.length = len;
            const taskString = task.toString();
            let maxConcurrency = this.ensureClampedMaxConcurrency(), error;
            let i = 0, resolved = 0;
            for (let w = 0; !error && i < Math.min(len, maxConcurrency); w++) {
                let worker = this._spawnWorker(taskString, env);
                if (!worker) {
                    if (!this.options.allowSynchronous)
                        throw new Error('Workers do not exist and synchronous operation not allowed!');
                    resolve(Promise
                        .all(data.map(d => new Promise((r, j) => {
                        try {
                            r(task(d));
                        }
                        catch (ex) {
                            j(ex);
                        }
                    }))));
                    return;
                }
                let next = () => {
                    if (error) {
                        worker = workers.recycle(worker);
                    }
                    if (worker) {
                        if (i < len) {
                            let ii = i++;
                            let wp = new WorkerPromise(worker, data[ii]);
                            wp
                                .thenSynchronous(r => {
                                result[ii] = r;
                                next();
                            }, e => {
                                if (!error) {
                                    error = e;
                                    reject(e);
                                    worker = workers.recycle(worker);
                                }
                            })
                                .thenThis(() => {
                                resolved++;
                                if (resolved > len)
                                    throw Error("Resolved count exceeds data length.");
                                if (resolved === len)
                                    resolve(result);
                            })
                                .finallyThis(() => wp.dispose());
                        }
                        else {
                            worker = workers.recycle(worker);
                        }
                    }
                };
                next();
            }
        });
    }
    static get isSupported() { return _supports; }
    static options(options) {
        return new Parallel(options);
    }
    static require(...required) {
        return (new Parallel()).requireThese(required);
    }
    static requireThese(required) {
        return (new Parallel()).requireThese(required);
    }
    static startNew(data, task, env) {
        return (new Parallel()).startNew(data, task, env);
    }
    static map(data, task, env) {
        return (new Parallel()).map(data, task, env);
    }
}
export default Parallel;
//# sourceMappingURL=Parallel.js.map