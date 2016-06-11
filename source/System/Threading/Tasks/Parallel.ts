/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Originally based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/parallel.js
 */

import {Promise, PromiseBase, ArrayPromise, PromiseCollection} from "../../Promises/Promise";
import {Type} from "../../Types";
import Worker from "../Worker";
import {WorkerLike} from "../WorkerType";
import {deferImmediate} from "../deferImmediate";
import {isNodeJS} from "../../Environment";
import {ObjectPool} from "../../Disposable/ObjectPool";
import {IMap} from "../../Collections/Dictionaries/IDictionary";

declare const navigator:any;
declare const require:any;
declare const self:any;
declare const __dirname:string;

//noinspection JSUnusedAssignment
const
	MAX_WORKERS:number = 16,
	VOID0:any = void 0,
	URL       = typeof self!==Type.UNDEFINED ? (self.URL ? self.URL : self.webkitURL) : null,
	_supports = (isNodeJS || self.Worker) ? true : false; // node always supports parallel

export interface ParallelOptions
{
	/**
	 * This is the path to the file eval.js.  This is required when running in node, and required for some browsers (IE 10) in order to work around cross-domain restrictions for web workers.  Defaults to the same location as parallel.js in node environments, and null in the browser.
	 **/
	evalPath?:string;

	/**
	 * The maximum number of permitted worker threads.  This will default to 4, or the number of CPUs on your computer if you're running node.
	 **/
	maxConcurrency?:number;

	/**
	 * If WebWorkers are not available, whether or not to fall back to synchronous processing using setTimeout.  Defaults to true.
	 **/
	allowSynchronous?:boolean;

	env?:any
	envNamespace?:string
}

//noinspection JSUnusedAssignment
const defaults:ParallelOptions = {
	evalPath: isNodeJS ? __dirname + '/eval.js' : null,
	maxConcurrency: isNodeJS ? require('os').cpus().length : (navigator.hardwareConcurrency || 4),
	allowSynchronous: true,
	env: {},
	envNamespace: 'env'
};

function extend<T extends any>(from:T, to:T):T
{
	if(!to) to = <any>{};
	for(var i of Object.keys(from))
	{
		if(to[i]=== void 0) to[i] = from[i];
	}
	return to;
}

function interact(
	w:WorkerLike,
	onMessage:(msg:{data:any})=>void,
	onError:(e:any)=>void,
	message?:any):void
{
	if(onMessage) w.onmessage = onMessage;
	if(onError) w.onerror = onError;
	if(message!==VOID0) w.postMessage(message);
}

class WorkerPromise<T> extends Promise<T>
{
	constructor(worker:WorkerLike, data:any)
	{
		super((resolve, reject)=>
		{
			interact(
				worker,
				(response:{data:any})=>
				{
					resolve(response.data);
				},
				(e:any)=>
				{
					reject(e);
				},
				data)
		}, true);
	}
}

export type RequireType = string | Function | {name?:string,fn:Function};

module workers
{

	function getPool(key:string):ObjectPool<WorkerLike>
	{
		var pool = workerPools[key];
		if(!pool)
		{
			workerPools[key] = pool = new ObjectPool<WorkerLike>(8);
			pool.autoClearTimeout = 3000; // Fast cleanup... 1s.
		}
		return pool;
	}

	var workerPools:IMap<ObjectPool<WorkerLike>> = {};

	export function recycle(w:WorkerLike):WorkerLike
	{ // always returns null.
		if(w)
		{
			w.onerror = null;
			w.onmessage = null;
			var k = (<any>w).__key;
			if(k)
			{
				getPool(k).add(w);
			}
			else
			{
				deferImmediate(()=>w.terminate());
			}
		}
		return null;
	}

	export function tryGet(key:string):WorkerLike
	{
		return getPool(key).tryTake();
	}

	export function getNew(key:string, url:string):WorkerLike
	{
		var worker:any = new Worker(url);
		worker.__key = key;
		worker.dispose = ()=>
		{
			worker.onmessage = null;
			worker.onerror = null;
			worker.dispose = null;
			worker.terminate();
		};
		return worker;
	}
}


export class Parallel
{

	options:ParallelOptions;
	_requiredScripts:string[];
	_requiredFunctions:{name?:string,fn:Function}[];

	constructor(options?:ParallelOptions)
	{
		this.options = extend(defaults, options);
		this._requiredScripts = [];
		this._requiredFunctions = [];

		this.ensureClampedMaxConcurrency();
	}

	static maxConcurrency(max:number):Parallel
	{
		return new Parallel({maxConcurrency: max});
	}

	getWorkerSource(task:Function|string, env?:any):string
	{
		var scripts = this._requiredScripts, functions = this._requiredFunctions;
		var preStr = '';

		if(!isNodeJS && scripts.length)
		{
			preStr += 'importScripts("' + scripts.join('","') + '");\r\n';
		}

		for(let {name, fn} of functions)
		{
			var source = fn.toString();
			preStr += name
				? `var ${name} = ${source};`
				: source;
		}


		env = JSON.stringify(env || {});

		const ns = this.options.envNamespace;

		return preStr + (
				isNodeJS
					? `process.on("message", function(e) {global.${ns} = ${env};process.send(JSON.stringify((${task.toString()})(JSON.parse(e).data)))})`
					: `self.onmessage = function(e) {var global = {}; global.${ns} = ${env}';self.postMessage((${task.toString()})(e.data))}`
			);
	}

	require(...required:RequireType[]):Parallel
	{
		return this.requireThese(required);
	}

	requireThese(required:RequireType[]):Parallel
	{
		for(let a of required)
		{
			switch(typeof a)
			{
				case Type.STRING:
					this._requiredScripts.push(<string>a);
					break;
				case Type.FUNCTION:
					this._requiredFunctions.push({fn: <Function>a});
					break;
				case Type.OBJECT:
					this._requiredFunctions.push(<{name?:string,fn:Function}>a);
					break;
				default:
					throw new TypeError("Invalid type.");

			}
		}
		return this;
	}


	protected _spawnWorker(task:Function|string, env?:any):WorkerLike
	{
		var src = this.getWorkerSource(task, env);

		if(Worker===VOID0) return VOID0;
		var worker = workers.tryGet(src);
		if(worker) return worker;

		var scripts = this._requiredScripts, evalPath = this.options.evalPath;

		if(!evalPath)
		{
			if(isNodeJS)
				throw new Error("Can't use NodeJD without eval.js!");
			if(scripts.length)
				throw new Error("Can't use required scripts without eval.js!");
			if(!URL)
				throw new Error("Can't create a blob URL in this browser!");
		}

		if(isNodeJS || scripts.length || !URL)
		{
			worker = workers.getNew(src, evalPath);
			worker.postMessage(src);
		}
		else if(URL)
		{
			var blob = new Blob([src], {type: 'text/javascript'});
			var url = URL.createObjectURL(blob);

			worker = workers.getNew(src, url);
		}

		return worker;
	}

	startNew<T,U>(data:T, task:(data:T) => U, env?:any):PromiseBase<U>
	{
		const _ = this;

		let worker = _._spawnWorker(task, extend(_.options.env, env || {}));
		if(worker)
			return new WorkerPromise<U>(worker, data)
				.finallyThis(()=>workers.recycle(worker));

		if(_.options.allowSynchronous)
			return new Promise<U>(
				(resolve, reject)=>
				{
					try
					{
						resolve(task(data));
					}
					catch(e)
					{
						reject(e);
					}
				});

		throw new Error('Workers do not exist and synchronous operation not allowed!');
	}

	pipe<T,U>(data:T[], task:(data:T) => U, env?:any):PromiseCollection<U>
	{
		let maxConcurrency = this.ensureClampedMaxConcurrency();
		return new PromiseCollection(
			data && data.map(
				d=>new Promise<U>((resolve, reject)=>
				{

				})));
	}

	private ensureClampedMaxConcurrency():number {
		let {maxConcurrency} = this.options;
		if(maxConcurrency>MAX_WORKERS)
		{
			this.options.maxConcurrency = maxConcurrency = MAX_WORKERS;
			console.warn(`More than ${MAX_WORKERS} workers can reach worker limits and cause unexpected results.  maxConcurrency reduced to ${MAX_WORKERS}.`);
		}
		return maxConcurrency;
	}

	map<T,U>(data:T[], task:(data:T) => U, env?:any):ArrayPromise<U>
	{
		if(!data || !data.length) return ArrayPromise.fulfilled(data && []);

		data = data.slice(); // Never use the original.
		return new ArrayPromise<U>((resolve, reject)=>
		{
			const result:U[] = [], len = data.length;
			result.length = len;

			const taskString = task.toString();
			let maxConcurrency = this.ensureClampedMaxConcurrency(), error:any;
			let i = 0, resolved = 0;
			for(let w = 0; !error && i<Math.min(len, maxConcurrency); w++)
			{
				let worker = this._spawnWorker(taskString, env);

				if(!worker)
				{
					if(!this.options.allowSynchronous)
						throw new Error('Workers do not exist and synchronous operation not allowed!');

					// Concurrency doesn't matter in a single thread... Just queue it all up.
					resolve(Promise
						.all(data.map(d=>new Promise<U>((r, j)=>
						{
							try
							{
								r(task(d));
							}
							catch(ex)
							{
								j(ex);
							}
						}))));

					return;
				}

				let next = ()=>
				{
					if(error)
					{
						worker = workers.recycle(worker);
					}

					if(worker)
					{
						if(i<len)
						{
							let ii = i++;
							let wp = new WorkerPromise<U>(worker, data[ii]);
							wp
								.thenSynchronous(r=>
								{
									result[ii] = r;
									next();
								}, e=>
								{
									if(!error)
									{
										error = e;
										reject(e);
										worker = workers.recycle(worker);
									}
								})
								.thenThis(()=>
								{
									resolved++;
									if(resolved>len) throw Error("Resolved count exceeds data length.");
									if(resolved===len) resolve(result);
								})
								.finallyThis(()=>
									wp.dispose());
						}
						else
						{
							worker = workers.recycle(worker);
						}
					}
				};
				next();
			}

		});

	}

	static get isSupported() { return _supports; }

	static options(options?:ParallelOptions):Parallel
	{
		return new Parallel(options);
	}

	static require(...required:RequireType[]):Parallel
	{
		return (new Parallel()).requireThese(required)
	}

	static requireThese(required:RequireType[]):Parallel
	{
		return (new Parallel()).requireThese(required)
	}

	static startNew<T,U>(data:T, task:(data:T) => U, env?:any):PromiseBase<U>
	{
		return (new Parallel()).startNew(data, task, env);
	}

	//
	// forEach<T>(data:T[], task:(data:T) => void, env?:any):PromiseBase<void>
	// {}

	static map<T,U>(data:T[], task:(data:T) => U, env?:any):ArrayPromise<U>
	{
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
