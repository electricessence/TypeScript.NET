/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/parallel.js
 */
import { Promise, Fulfilled } from "../../Promises/Promise";
import { Type } from "../../Types";
import Worker from "../Worker";
import { deferImmediate } from "../deferImmediate";
import { isNodeJS } from "../../Environment";
const VOID0 = void 0, URL = typeof self !== Type.UNDEFINED ? (self.URL ? self.URL : self.webkitURL) : null, _supports = (isNodeJS || self.Worker) ? true : false;
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
function terminate(worker) {
    if (worker)
        deferImmediate(() => worker.terminate());
    return null;
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
export class Parallel {
    constructor(options) {
        this.options = extend(defaults, options);
        this._requiredScripts = [];
        this._requiredFunctions = [];
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
        var worker;
        var src = this.getWorkerSource(task, env);
        if (Worker === VOID0)
            return VOID0;
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
            worker = new Worker(evalPath);
            worker.postMessage(src);
        }
        else if (URL) {
            var blob = new Blob([src], { type: 'text/javascript' });
            var url = URL.createObjectURL(blob);
            worker = new Worker(url);
        }
        return worker;
    }
    startNew(data, task, env) {
        const _ = this;
        let worker = _._spawnWorker(task, extend(_.options.env, env || {}));
        if (worker)
            return new WorkerPromise(worker, data)
                .finallyThis(() => worker.terminate());
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
    forEach(data, task, env) {
        if (!data || !data.length)
            return new Fulfilled();
        data = data.slice();
        return new Promise((resolve, reject) => {
            var { maxConcurrency } = this.options, error;
            let i = 0, resolved = 0;
            for (let w = 0, len = data.length; !error && i < Math.min(len, maxConcurrency); w++) {
                let worker = this._spawnWorker(task, env);
                if (!worker) {
                    if (!this.options.allowSynchronous)
                        throw new Error('Workers do not exist and synchronous operation not allowed!');
                    Promise
                        .all(data.map(d => new Promise((r, j) => {
                        try {
                            r(task(d));
                        }
                        catch (ex) {
                            j(ex);
                        }
                    })))
                        .thenThis(() => resolve, reject);
                    return;
                }
                let next = () => {
                    if (error) {
                        worker = terminate(worker);
                    }
                    if (worker) {
                        if (i < len) {
                            let wp = new WorkerPromise(worker, data[i++]);
                            wp
                                .thenSynchronous(next, e => {
                                if (!error) {
                                    error = e;
                                    reject(e);
                                    worker = terminate(worker);
                                }
                            })
                                .thenThis(() => {
                                resolved++;
                                if (resolved > len)
                                    throw Error("Resolved count exceeds data length.");
                                if (resolved === len)
                                    resolve();
                            })
                                .finallyThis(() => wp.dispose());
                        }
                        else {
                            worker = terminate(worker);
                        }
                    }
                };
                next();
            }
        });
    }
}
export default Parallel;
//# sourceMappingURL=Parallel.js.map