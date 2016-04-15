/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../Tasks/ICancellable.d.ts"/>
///<reference path="ITimer.d.ts"/>
import ObservableBase from "./../Observable/ObservableBase";

export default class Timer extends ObservableBase<number> implements ITimer, ICancellable
{

	private _cancel:()=>void;
	private _count:number = 0;

	constructor(
		private _interval:number,
		private _maxCount:number = Infinity,
		private _initialDelay = _interval)
	{
		super();

		if(_interval===null || _interval=== void(0))
			throw "'interval' must be a valid number.";
		if(_interval<0)
			throw "'interval' cannot be negative.";
	}

	static startNew(
		interval:number,
		maxCount:number = Infinity,
		initialDelay:number = interval):Timer
	{
		var t = new Timer(interval, maxCount, interval);
		t.start();
		return t;
	}

	get isRunning():boolean
	{
		return !!this._cancel;
	}

	get count():number
	{
		return this._count;
	}

	start():void
	{
		var _ = this;
		if(!_._cancel && _._count<_._maxCount)
		{
			// For now, if it's isn't the start...
			if(_._count || _._initialDelay==_._interval)
			{
				let i = setInterval(
					Timer._onTick,
					_._interval,
					_);

				_._cancel = ()=>
				{
					clearInterval(i);
				}
			}
			else
			{
				let i = setTimeout(
					Timer._onTick,
					_._initialDelay,
					_, true);

				_._cancel = ()=>
				{
					clearTimeout(i);
				}
			}
		}

	}

	stop():void
	{
		this.cancel();
	}

	reset():void
	{
		this.stop();
		this._count = 0;
	}

	cancel():boolean {
		if(this._cancel)
		{
			this._cancel();
			this._cancel = null;
			return true;
		}
		return false;
	}

	dispose():void {
		this.cancel();
		super.dispose();
	}

	// We use a private static here so there's no need to create a handler every time.
	private static _onTick(
		timer:Timer,
		reInitTimer?:boolean):void
	{
		var index      = timer._count++,
		    max        = timer._maxCount,
		    isComplete = timer._count>=max;

		if(reInitTimer)
		{
			timer.cancel();
			timer.start();
		}

		if(isComplete)
		{
			timer.stop();
		}

		if(index<max)
		{
			timer._onNext(index);
		}

		if(isComplete)
		{
			timer._onCompleted();
		}
	}

}