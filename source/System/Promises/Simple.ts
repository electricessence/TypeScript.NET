import Type from "../Types";
import * as Methods from "./Methods";
import * as PromiseCallbacks from "./Callbacks";
import {IPromiseCallbacks} from "./Callbacks";


const VOID0:any = void 0;

function isPromise<T>(value:any):value is PromiseLike<T>
{
	return Type.hasMemberOfType(value, "then", Type.FUNCTION);
}

export class Resolved<T> implements PromiseLike<T>
{
	constructor(protected _result:T, protected _error?:any)
	{
	}

	then<TResult>(
		onFulfilled:Methods.Fulfill<T,TResult>,
		onRejected?:Methods.Reject<TResult>):PromiseLike<TResult>
	{
		try
		{
			var e = this._error;
			if(e!==VOID0)
			{
				let rejection = onRejected ? onRejected(e) : e;
				return rejection && isPromise(rejection)
					? rejection : rejected(rejection);
			}
			else
			{
				let result = onFulfilled ? onFulfilled(this._result) : this._result;
				return result && isPromise(result)
					? result : fulfilled(result);
			}
		}
		catch(ex)
		{
			return rejected(ex);
		}
	}

	'catch'<TResult>(onRejected:Methods.Reject<TResult>):PromiseLike<TResult>
	{
		return this.then(VOID0, onRejected)
	}

	'finally'<TResult>(fin:()=>Methods.Resolution<TResult>):PromiseLike<TResult>
	{
		return this.then(fin, fin);
	}

}


export class Promise<T> extends Resolved<T>
{

	protected _observers:IPromiseCallbacks<any>[];

	constructor()
	{
		super(VOID0);
	}

	then<TResult>(
		onFulfilled:Methods.Fulfill<T,TResult>,
		onRejected?:Methods.Reject<TResult>):PromiseLike<TResult>
	{
		var o = this._observers;
		if(o===VOID0) this._observers = o = [];

		// Already fulfilled?
		if(!o) return super.then(onFulfilled, onRejected);

		// Still pending?
		var p = new Promise<TResult>();
		this._observers.push(PromiseCallbacks.init(onFulfilled, onRejected, p));
		return p;
	}

	fulfill(result:T):void
	{
		this._result = result;
		this._error = VOID0;
		var o = this._observers;
		if(o)
		{
			this._observers = null; // null = finished. undefined = hasn't started.
			for(let c of o)
			{
				let {onFulfilled, promise} = c, p = (<Promise<T>>promise);
				PromiseCallbacks.recycle(c);
				try {
					p.fulfill(onFulfilled ? onFulfilled(result) : result);
				} catch (ex) {
					p.reject(ex);
				}
			}
			o.length = 0;
		}
	}

	reject(error:any):void
	{
		this._error = error;
		var o = this._observers;
		if(o)
		{
			this._observers = null; // null = finished. undefined = hasn't started.
			for(let c of o)
			{
				let {onRejected, promise} = c, p = (<Promise<T>>promise);
				PromiseCallbacks.recycle(c);
				try {
					p.reject(onRejected ? onRejected(error) : error);
				} catch (ex) {
					p.reject(ex);
				}
			}
			o.length = 0;
		}
	}
}

export function fulfilled<T>(value:T):Resolved<T>
{
	return new Resolved(value);
}

export function rejected(error:any):Resolved<any>
{
	return new Resolved(VOID0, error);
}

