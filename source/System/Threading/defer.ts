/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {ICancellable} from "./ICancellable";
import {Closure, Func} from "../FunctionTypes";
import __extendsImport from "../../extends";
const __extends = __extendsImport;

abstract class DeferBase implements ICancellable
{
	// It may be a Timer in node, should not be restricted to number.
	protected _id:any;

	abstract cancel():boolean;

	dispose():void
	{
		this.cancel();
	}
}

class Defer extends DeferBase
{


	constructor(task:Function, delay?:number, payload?:any)
	{
		super();
		if(!(delay>0)) delay = 0; // covers undefined and null.
		this._id = setTimeout(Defer.handler, delay, task, this, payload);
	}

	cancel():boolean
	{
		var id = this._id;
		if(id)
		{
			clearTimeout(id);
			this._id = null;
			return true;
		}
		return false;
	}

	// Use a static function here to avoid recreating a new function every time.
	private static handler(task:Function, d:Defer, payload?:any):void
	{
		d.cancel();
		task(payload);
	}

}

class DeferInterval extends DeferBase
{


	constructor(
		task:Function,
		interval:number,
		private _remaining:number = Infinity)
	{
		super();
		if(interval===null || interval=== void(0))
			throw "'interval' must be a valid number.";
		if(interval<0)
			throw "'interval' cannot be negative.";

		this._id = setInterval(DeferInterval.handler, interval, task, this);
	}

	cancel():boolean
	{
		var id = this._id;
		if(id)
		{
			clearInterval(id);
			this._id = null;
			return true;
		}
		return false;
	}

	private static handler(task:Function, d:DeferInterval):void
	{
		if(!(--d._remaining)) d.cancel();
		task();
	}

}


export function defer(
	task:Closure,
	delay?:number):ICancellable;

export function defer<T>(
	task:Func<T>,
	delay?:number,
	payload?:T):ICancellable

export function defer<T>(
	task:Function,
	delay?:number,
	payload?:any):ICancellable
{
	return new Defer(task, delay, payload);
}

export function interval(
	task:Function,
	interval:number,
	count:number = Infinity):ICancellable
{
	return new DeferInterval(task, interval, count);
}

export default defer;