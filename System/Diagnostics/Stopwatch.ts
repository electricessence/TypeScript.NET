/*
 * @author electricessence / https://github.com/electricessence/
 * Origin: .NET System C# Source
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Diagnostics
{

	export class Stopwatch
	{

		static getTimestampMilliseconds():number
		{
			return (new Date()).getTime();
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

		static measure(closure:()=>void):number
		{
			var start = Stopwatch.getTimestampMilliseconds();
			closure();
			return Stopwatch.getTimestampMilliseconds() - start;
		}

		record(closure:()=>void):number
		{
			// Although a thread safe way to record, it may not correctly represent time in an async scenario.
			var e = Stopwatch.measure(closure);
			this._elapsed += e;
			return e;
		}

		start():void
		{
			var _ = this;
			if(!_._isRunning)
			{
				_._startTimeStamp = Stopwatch.getTimestampMilliseconds();
				_._isRunning = true;
			}
		}

		stop():void
		{
			var _ = this;
			if(_._isRunning)
			{
				_._elapsed += _.currentLap;
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
		lap():number
		{
			var _ = this;
			if(_._isRunning)
			{
				var t = Stopwatch.getTimestampMilliseconds();
				var s = _._startTimeStamp;
				var e = t - s;
				_._startTimeStamp = t;
				_._elapsed += e;
				return e;
			}
			else
				return 0;
		}

		get currentLap():number
		{
			return this._isRunning
				? (Stopwatch.getTimestampMilliseconds() - this._startTimeStamp)
				: 0;
		}

		get elapsedMilliseconds():number
		{
			var _ = this;
			var timeElapsed = _._elapsed;

			if(_._isRunning)
				timeElapsed += _.currentLap;

			return timeElapsed;
		}

		// TODO: Convert these elapsed methods to "TimeSpan".
		get elapsedSeconds():number
		{
			return this.elapsedMilliseconds / 1000;
		}

	}

} 