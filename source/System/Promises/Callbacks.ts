import {Promise as Methods} from "./Promise";
import {ObjectPool} from "../Disposable/ObjectPool";


export interface IPromiseCallbacks<T>
{
	onFulfilled:Methods.Fulfill<T,any>;
	onRejected:Methods.Reject<any>;
	promise?:PromiseLike<any>;
}


var pool:ObjectPool<IPromiseCallbacks<any>>;
function factory():IPromiseCallbacks<any>{
	return {
		onFulfilled:null,
		onRejected:null,
		promise:null
	}
}

export function init<T>(
	onFulfilled:Methods.Fulfill<T,any>,
	onRejected?:Methods.Reject<any>,
	promise?:PromiseLike<any>):IPromiseCallbacks<T>
{

	if(!pool) pool = new ObjectPool<IPromiseCallbacks<any>>(40, factory);
	var c = pool.take();
	c.onFulfilled = onFulfilled;
	c.onRejected = onRejected;
	c.promise = promise;
	return c;
}

export function release<T>(to:PromiseLike<T>, c:IPromiseCallbacks<T>):void
{
	let {onFulfilled, onRejected} = c;
	recycle(c);
	to.then(onFulfilled, onRejected);
}

export function recycle<T>(c:IPromiseCallbacks<T>):void
{
	c.onFulfilled = null;
	c.onRejected = null;
	c.promise = null;
	pool.add(c);
}


