/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import ICancellable from "../Threading/ICancellable";
import ObservableBase from "../Observable/ObservableBase";
import ITimer from "./ITimer";
import {Closure} from "../FunctionTypes";

/**
 * A timer class that uses an Observable pattern to allow for subscribing to ticks.
 */
export default class Timer extends ObservableBase<number> implements ITimer, ICancellable
{

	private _cancel:Closure | undefined;
	private _count:number = 0;

	constructor(
		private _interval:number,
		private _maxCount:number = Infinity,
		private _initialDelay = _interval)
	{
		super();

		if(_interval===null)
			throw "'interval' must be a valid number.";
		if(_interval<0)
			throw "'interval' cannot be negative.";
	}

	/**
	 * Initializes a new timer and starts it.
	 * @param millisecondInterval
	 * @param maxCount
	 * @param initialDelay
	 * @returns {Timer}
	 */
	static startNew(
		millisecondInterval:number,
		maxCount:number = Infinity,
		initialDelay:number = millisecondInterval):Timer
	{
		const t = new Timer(millisecondInterval, maxCount, initialDelay);
		t.start();
		return t;
	}

	/**
	 * Returns true if the timer is running.
	 * @returns {boolean}
	 */
	get isRunning():boolean
	{
		return !!this._cancel;
	}

	/**
	 * Returns the number of times the timer has ticked (onNext);
	 * @returns {number}
	 */
	get count():number
	{
		return this._count;
	}

	/**
	 * Starts the timer.
	 */
	start():void
	{
		const _ = this;
		_.throwIfDisposed("This timer has been disposed and can't be reused.");
		if(!_._cancel && _._count<_._maxCount)
		{
			// For now, if it's isn't the start...
			if(_._count || _._initialDelay===_._interval)
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

	/**
	 * Stops the timer.  Is the same as cancel.
	 */
	stop():void
	{
		this.cancel();
	}

	/**
	 * Stops the timer and resets the count.
	 */
	reset():void
	{
		this.stop();
		this._count = 0;
	}

	/**
	 * Forces the onComplete to propagate and returns the number of times the timer ticked.
	 * @returns {number}
	 */
	complete():number
	{
		this.cancel();
		this._onCompleted();
		return this._count;
	}

	/**
	 * Cancels the timer and returns true if the timer was running.  Returns false if already cancelled.
	 * @returns {boolean}
	 */
	cancel():boolean
	{
		if(this._cancel)
		{
			this._cancel();
			this._cancel = undefined;
			return true;
		}
		return false;
	}

	protected _onDispose():void
	{
		this.cancel();
		super._onDispose();
	}

	// We use a private static here so there's no need to create a handler every time.
	private static _onTick(
		timer:Timer,
		reInitTimer?:boolean):void
	{
		const index      = timer._count++,
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