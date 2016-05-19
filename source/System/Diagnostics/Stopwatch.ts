/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {TimeSpan} from "../Time/TimeSpan";
import {ITimer} from "../Timers/ITimer";

function getTimestampMilliseconds():number
{
	return (new Date()).getTime();
}

export default
class Stopwatch implements ITimer
{

	static getTimestampMilliseconds():number
	{
		return getTimestampMilliseconds();
	}

	private _elapsed:number;
	private _startTimeStamp:number;

	private _isRunning:boolean;
	get isRunning():boolean
	{
		return this._isRunning;
	}

	constructor()
	{
		this.reset();
	}

	static startNew():Stopwatch
	{
		var s = new Stopwatch();
		s.start();
		return s;
	}

	static measure(closure:()=>void):TimeSpan
	{
		var start = getTimestampMilliseconds();
		closure();
		return new TimeSpan(getTimestampMilliseconds() - start);
	}

	start():void
	{
		var _ = this;
		if(!_._isRunning)
		{
			_._startTimeStamp = getTimestampMilliseconds();
			_._isRunning = true;
		}
	}

	stop():void
	{
		var _ = this;
		if(_._isRunning)
		{
			_._elapsed += _.currentLapMilliseconds;
			_._isRunning = false;
		}
	}

	reset():void
	{
		var _ = this;
		_._elapsed = 0;
		_._isRunning = false;
		_._startTimeStamp = NaN;
	}

	// Effectively calls a stop start and continues timing...
	// Can also be called to effectively start a lap before calling it again to get the elapsed lap time.
	lap():TimeSpan
	{
		var _ = this;
		if(_._isRunning)
		{
			var t = getTimestampMilliseconds();
			var s = _._startTimeStamp;
			var e = t - s;
			_._startTimeStamp = t;
			_._elapsed += e;
			return new TimeSpan(e);
		}
		else
			return TimeSpan.zero;
	}

	get currentLapMilliseconds():number
	{
		return this._isRunning
			? (getTimestampMilliseconds() - this._startTimeStamp)
			: 0;
	}

	get currentLap():TimeSpan
	{
		return this._isRunning
			? new TimeSpan(this.currentLapMilliseconds)
			: TimeSpan.zero;
	}

	get elapsedMilliseconds():number
	{
		var _ = this;
		var timeElapsed = _._elapsed;

		if(_._isRunning)
			timeElapsed += _.currentLapMilliseconds;

		return timeElapsed;
	}

	get elapsed():TimeSpan
	{
		return new TimeSpan(this.elapsedMilliseconds);
	}

}
