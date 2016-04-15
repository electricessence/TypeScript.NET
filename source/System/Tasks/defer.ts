///<reference path="ICancellable.d.ts"/>
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


abstract class DeferBase implements ICancellable
{
	protected _id:number;

	abstract cancel():boolean;

	dispose():void
	{
		this.cancel();
	}
}

class Defer extends DeferBase
{


	constructor(task:Function, delay?:number)
	{
		super();
		if(!(delay>=0)) delay = 0;
		this._id = setTimeout(Defer.handler, delay, task, this);
	}

	cancel():boolean
	{
		var id = this._id;
		if(id)
		{
			clearTimeout(id);
			this._id = 0;
			return true;
		}
		return false;
	}

	// Use a static function here to avoid recreating a new function every time.
	private static handler(task:Function, d:Defer):void
	{
		d.cancel();
		task();
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
			this._id = 0;
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


export default function defer(
	task:Function,
	delay?:number):ICancellable
{
	return new Defer(task, delay);
}

export function interval(
	task:Function,
	interval:number,
	count:number = Infinity):ICancellable
{
	return new DeferInterval(task, interval, count);
}