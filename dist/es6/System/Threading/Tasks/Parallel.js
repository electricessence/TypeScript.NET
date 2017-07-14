/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Originally based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/parallel.js
 */
import { ArrayPromise, TSDNPromise, PromiseCollection } from "../../Promises/Promise";
import { Type } from "../../Types";
import Worker from "../Worker";
import { deferImmediate } from "../deferImmediate";
import { isNodeJS } from "../../Environment";
import { ObjectPool } from "../../Disposable/ObjectPool";
//noinspection JSUnusedAssignment
const MAX_WORKERS = 16, VOID0 = void 0, URL = typeof self !== Type.UNDEFINED
    ? (self.URL ? self.URL : self.webkitURL)
    : null, _supports = isNodeJS || !!self.Worker; // node always supports parallel
//noinspection JSUnusedAssignment
const defaults = {
    evalPath: isNodeJS ? __dirname + '/eval.js' : VOID0,
    maxConcurrency: isNodeJS
        ? require('os').cpus().length
        : (navigator.hardwareConcurrency || 4),
    allowSynchronous: true,
    env: {},
    envNamespace: 'env'
};
function extend(from, to) {
    if (!to)
        to = {};
    for (let i of Object.keys(from)) {
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
class WorkerPromise extends TSDNPromise {
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
    /*
     * Note:
     * Currently there is nothing preventing excessive numbers of workers from being generated.
     * Eventually there will be a master pool count which will regulate these workers.
     */
    function getPool(key) {
        let pool = workerPools[key];
        if (!pool) {
            workerPools[key] = pool = new ObjectPool(8);
            pool.autoClearTimeout = 3000; // Fast cleanup... 1s.
        }
        return pool;
    }
    const workerPools = {};
    function recycle(w) {
        if (w) {
            w.onerror = null;
            w.onmessage = null;
            const k = w.__key;
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
        const worker = new Worker(url);
        worker.__key = key;
        if (!worker.dispose) {
            worker.dispose = () => {
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
    _getWorkerSource(task, env) {
        const scripts = this._requiredScripts, functions = this._requiredFunctions;
        let preStr = '';
        if (!isNodeJS && scripts.length) {
            preStr += 'importScripts("' + scripts.join('","') + '");\r\n';
        }
        for (let { name, fn } of functions) {
            const source = fn.toString();
            preStr += name
                ? `var ${name} = ${source};`
                : source;
        }
        env = JSON.stringify(env || {});
        const ns = this.options.envNamespace;
        return preStr + (isNodeJS
            ? `process.on("message", function(e) {global.${ns} = ${env};process.send(JSON.stringify((${task.toString()})(JSON.parse(e).data)))})`
            : `self.onmessage = function(e) {var global = {}; global.${ns} = ${env};self.postMessage((${task.toString()})(e.data))}`);
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
        const src = this._getWorkerSource(task, env);
        if (Worker === VOID0)
            return VOID0;
        let worker = workers.tryGet(src);
        if (worker)
            return worker;
        const scripts = this._requiredScripts;
        let evalPath = this.options.evalPath;
        if (!evalPath) {
            if (isNodeJS)
                throw new Error("Can't use NodeJS without eval.js!");
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
            const blob = new Blob([src], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            worker = workers.getNew(src, url);
        }
        return worker;
    }
    /**
     * Schedules the task to be run in the worker pool.
     * @param data
     * @param task
     * @param env
     * @returns {TSDNPromise<U>|TSDNPromise}
     */
    startNew(data, task, env) {
        const _ = this;
        const maxConcurrency = this.ensureClampedMaxConcurrency();
        const worker = maxConcurrency ? _._spawnWorker(task, extend(_.options.env, env || {})) : null;
        if (worker) {
            return new WorkerPromise(worker, data)
                .finallyThis(() => workers.recycle(worker));
        }
        if (_.options.allowSynchronous)
            return this.startLocal(data, task);
        throw new Error(maxConcurrency
            ? "Workers do not exist and synchronous operation not allowed!"
            : "'maxConcurrency' set to 0 but 'allowSynchronous' is false.");
    }
    /**
     * Runs the task within the local thread/process.
     * Is good for use with testing.
     * @param data
     * @param task
     * @returns {TSDNPromise<U>|TSDNPromise}
     */
    startLocal(data, task) {
        return new TSDNPromise((resolve, reject) => {
            try {
                resolve(task(data));
            }
            catch (e) {
                reject(e);
            }
        });
    }
    /**
     * Returns an array of promises that each resolve after their task completes.
     * Provides a potential performance benefit by not waiting for all promises to resolve before proceeding to next step.
     * @param data
     * @param task
     * @param env
     * @returns {PromiseCollection}
     */
    pipe(data, task, env) {
        // The resultant promise collection will make an internal copy...
        let result;
        if (data && data.length) {
            const len = data.length;
            const taskString = task.toString();
            const maxConcurrency = this.ensureClampedMaxConcurrency();
            let error;
            let i = 0;
            for (let w = 0; !error && i < Math.min(len, maxConcurrency); w++) {
                let worker = maxConcurrency ? this._spawnWorker(taskString, env) : null;
                if (!worker) {
                    if (!this.options.allowSynchronous)
                        throw new Error(maxConcurrency
                            ? "Workers do not exist and synchronous operation not allowed!"
                            : "'maxConcurrency' set to 0 but 'allowSynchronous' is false.");
                    // Concurrency doesn't matter in a single thread... Just queue it all up.
                    return TSDNPromise.map(data, task);
                }
                if (!result) {
                    // There is a small risk that the consumer could call .resolve() which would result in a double resolution.
                    // But it's important to minimize the number of objects created.
                    result = data.map(d => new TSDNPromise());
                }
                let next = () => {
                    if (error) {
                        worker = workers.recycle(worker);
                    }
                    if (worker) {
                        if (i < len) {
                            //noinspection JSReferencingMutableVariableFromClosure
                            let ii = i++, p = result[ii];
                            let wp = new WorkerPromise(worker, data[ii]);
                            //noinspection JSIgnoredPromiseFromCall
                            wp.thenSynchronous(r => {
                                //noinspection JSIgnoredPromiseFromCall
                                p.resolve(r);
                                next();
                            }, e => {
                                if (!error) {
                                    error = e;
                                    //noinspection JSIgnoredPromiseFromCall
                                    p.reject(e);
                                    worker = workers.recycle(worker);
                                }
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
        }
        return new PromiseCollection(result);
    }
    ensureClampedMaxConcurrency() {
        let { maxConcurrency } = this.options;
        if (maxConcurrency && maxConcurrency > MAX_WORKERS) {
            this.options.maxConcurrency = maxConcurrency = MAX_WORKERS;
            console.warn(`More than ${MAX_WORKERS} workers can reach worker limits and cause unexpected results.  maxConcurrency reduced to ${MAX_WORKERS}.`);
        }
        return (maxConcurrency || maxConcurrency === 0) ? maxConcurrency : MAX_WORKERS;
    }
    /**
     * Waits for all tasks to resolve and returns a promise with the results.
     * @param data
     * @param task
     * @param env
     * @returns {ArrayPromise}
     */
    map(data, task, env) {
        if (!data || !data.length)
            return ArrayPromise.fulfilled(data && []);
        // Would return the same result, but has extra overhead.
        // return this.pipe(data,task).all();
        data = data.slice(); // Never use the original.
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
                    // Concurrency doesn't matter in a single thread... Just queue it all up.
                    resolve(TSDNPromise.map(data, task).all());
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
                            //noinspection JSIgnoredPromiseFromCall
                            wp.thenSynchronous(r => {
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
    //
    // forEach<T>(data:T[], task:(data:T) => void, env?:any):PromiseBase<void>
    // {}
    static map(data, task, env) {
        return (new Parallel()).map(data, task, env);
    }
}
//
//
// 	private _spawnReduceWorker<N>(
// 		data:any,
// 		cb:(data:N) => N,
// 		done:(err?:any, wrk?:WorkerLike)=>void,
// 		env?:any,
// 		wrk?:WorkerLike)
// 	{
// 		const _ = this;
// 		if(!wrk) wrk = _._spawnWorker(cb, env);
//
// 		if(wrk!==VOID0)
// 		{
// 			interact(wrk,
// 				msg=>
// 				{
// 					_.data[_.data.length] = msg.data;
// 					done(null, wrk);
// 				},
// 				e=>
// 				{
// 					wrk.terminate();
// 					done(e, null);
// 				},
// 				data);
// 		}
// 		else if(_.options.allowSynchronous)
// 		{
// 			deferImmediate(()=>
// 			{
// 				_.data[_.data.length] = cb(data);
// 				done();
// 			});
// 		}
// 		else
// 		{
// 			throw new Error('Workers do not exist and synchronous operation not allowed!');
// 		}
// 	}
//
//
//
//
// 	reduce<N>(cb:(data:N[]) => N, env?:any):Parallel<T>
// 	{
// 		env = extend(this.options.env, env || {});
//
// 		var runningWorkers = 0;
// 		const _ = this;
//
//
// 		_._operation = new Promise<any>((resolve, reject)=>
// 		{
//
// 			const done = (err?:any, wrk?:WorkerLike)=>
// 			{
// 				--runningWorkers;
// 				if(err)
// 				{
// 					reject(err);
// 				}
// 				else if(_.data.length===1 && runningWorkers===0)
// 				{
// 					resolve(_.data = _.data[0]);
// 					if(wrk) wrk.terminate();
// 				}
// 				else if(_.data.length>1)
// 				{
// 					++runningWorkers;
// 					_._spawnReduceWorker([_.data[0], _.data[1]], cb, done, env, wrk);
// 					_.data.splice(0, 2);
// 				}
// 				else
// 				{
// 					if(wrk) wrk.terminate();
// 				}
// 			};
//
// 			if(_.data.length===1)
// 			{
// 				resolve(_.data[0]);
// 			}
// 			else
// 			{
// 				for(var i = 0; i<_.options.maxConcurrency && i<Math.floor(_.data.length/2); ++i)
// 				{
// 					++runningWorkers;
// 					_._spawnReduceWorker([_.data[i*2], _.data[i*2 + 1]], cb, done, env);
// 				}
//
// 				_.data.splice(0, i*2);
// 			}
// 		}, true);
// 		return this;
//
// 	}
export default Parallel;
//# sourceMappingURL=Parallel.js.map