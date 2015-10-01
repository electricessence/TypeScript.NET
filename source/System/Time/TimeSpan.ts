/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

'use strict';

///<reference path="ITimeMeasurement.d.ts"/>
///<reference path="../IEquatable.d.ts"/>
///<reference path="../IComparable.d.ts"/>
import Values = require('../Compare');
import Types = require('../Types');
import TimeUnit = require('./TimeUnit');
import HowMany = require('./HowMany');
import TimeUnitValue = require('./TimeUnitValue');
import ClockTime = require('./ClockTime');


class TimeSpan implements ITimeMeasurement, IEquatable<TimeSpan>, IComparable<TimeSpan>, ITimeTotal
{

	private _milliseconds:number;

	// In .NET the default type is Ticks, but for JavaScript, we will use Milliseconds.
	constructor(value:number, units:TimeUnit = TimeUnit.Milliseconds)
	{
		this._milliseconds = TimeSpan.convertToMilliseconds(value, units);
	}

	equals(other:TimeUnitValue):boolean;
	equals(other:TimeSpan):boolean;
	equals(other:any):boolean
	{
		var otherMS:number = getMilliseconds(other);

		if(other===undefined) // undefined is used instead of NaN since NaN could be a valid value.
			return false;

		return Values.areEqual(this._milliseconds, otherMS);
	}


	compareTo(other:TimeUnitValue):number;
	compareTo(other:TimeSpan):number;
	compareTo(other:any):number
	{
		if(other==null) return 1 | 0;

		assertComparisonType(other);

		return Values.compare(this._milliseconds, getMilliseconds(other));

	}

	toTimeUnitValue(units:TimeUnit = TimeUnit.Milliseconds):TimeUnitValue
	{
		return new TimeUnitValue(this.getTotal(units), units);
	}

	static convertToMilliseconds(value:number, units:TimeUnit = TimeUnit.Milliseconds):number
	{
		// noinspection FallThroughInSwitchStatementJS
		switch(units)
		{
			case TimeUnit.Days:
				value *= HowMany.Hours.Per.Day;
			case TimeUnit.Hours:
				value *= HowMany.Minutes.Per.Hour;
			case TimeUnit.Minutes:
				value *= HowMany.Seconds.Per.Minute;
			case TimeUnit.Seconds:
				value *= HowMany.Milliseconds.Per.Second;
			case TimeUnit.Milliseconds:
				return value;
			case TimeUnit.Ticks:
				return value/HowMany.Ticks.Per.Millisecond;
			default:
				throw new Error("Invalid TimeUnit.");
		}
	}

	getTotal(units:TimeUnit):number
	{
		var _ = this;
		switch(units)
		{
			case TimeUnit.Days:
				return _.days;
			case TimeUnit.Hours:
				return _.hours;
			case TimeUnit.Minutes:
				return _.minutes;
			case TimeUnit.Seconds:
				return _.seconds;
			case TimeUnit.Milliseconds:
				return _._milliseconds;
			case TimeUnit.Ticks:
				return _._milliseconds*HowMany.Ticks.Per.Millisecond;
			default:
				throw new Error("Invalid TimeUnit.");
		}
	}

	get ticks():number
	{
		return this._milliseconds
			*HowMany.Ticks.Per.Millisecond;
	}

	get milliseconds():number
	{
		return this._milliseconds;
	}

	get seconds():number
	{
		return this._milliseconds
			/HowMany.Milliseconds.Per.Second;
	}

	get minutes():number
	{
		return this.seconds
			/HowMany.Seconds.Per.Minute;
	}

	get hours():number
	{
		return this.minutes
			/HowMany.Minutes.Per.Hour;
	}

	get days():number
	{
		return this.hours
			/HowMany.Hours.Per.Day;
	}

	// Provides an interface only way of acquiring the getTotal time.
	get total():ITimeMeasurement {
		return this;
	}

	// Instead of the confusing getTotal versus unit name, expose a 'ClockTime' value which reports the individual components.
	get time():ClockTime
	{
		return new ClockTime(this._milliseconds);
	}

	add(other:ClockTime):TimeSpan;
	add(other:TimeUnitValue):TimeSpan;
	add(other:TimeSpan):TimeSpan;
	add(other:any):TimeSpan
	{
		if(Types.isNumber(other))
			throw new Error(
				"Use .addUnit to add a numerical value amount.  " +
				".add only supports ClockTime, TimeSpan, and TimeUnitValue."
			);

		if(other instanceof TimeUnitValue || other instanceof ClockTime)
			other = other.toTimeSpan();

		return new TimeSpan(this._milliseconds + other.milliseconds);
	}

	addUnit(value:number, units:TimeUnit = TimeUnit.Milliseconds):TimeSpan
	{
		return new TimeSpan(this._milliseconds + TimeSpan.convertToMilliseconds(value, units));
	}


	static from(value:number, units:TimeUnit)
	{
		return new TimeSpan(value, units);
	}

	static fromDays(value:number):TimeSpan
	{
		return new TimeSpan(value, TimeUnit.Days);
	}

	static fromHours(value:number):TimeSpan
	{
		return new TimeSpan(value, TimeUnit.Hours);
	}

	static fromMinutes(value:number):TimeSpan
	{
		return new TimeSpan(value, TimeUnit.Minutes);
	}

	static fromSeconds(value:number):TimeSpan
	{
		return new TimeSpan(value, TimeUnit.Seconds);
	}

	static fromMilliseconds(value:number):TimeSpan
	{
		return new TimeSpan(value, TimeUnit.Milliseconds);
	}

	static fromTicks(value:number):TimeSpan
	{
		return new TimeSpan(value, TimeUnit.Ticks);
	}

	static fromTime(
		hours:number,
		minutes:number,
		seconds:number = 0,
		milliseconds:number = 0):TimeSpan
	{
		return new TimeSpan(
			TimeSpan.millisecondsFromTime(
				hours, minutes, seconds, milliseconds
			)
		);
	}

	static millisecondsFromTime(
		hours:number,
		minutes:number,
		seconds:number = 0,
		milliseconds:number = 0):number
	{
		var value = hours;
		value *= HowMany.Minutes.Per.Hour;
		value += minutes;
		value *= HowMany.Seconds.Per.Minute;
		value += seconds;
		value *= HowMany.Milliseconds.Per.Second;
		value += milliseconds;
		return value;
	}

	static between(first:Date, last:Date):TimeSpan
	{
		return new TimeSpan(last.getTime() - first.getTime());
	}


	static get zero():TimeSpan
	{
		return timeSpanZero || (timeSpanZero = new TimeSpan(0));
	}
}


function assertComparisonType(other:any):void
{
	if(!(other instanceof TimeUnitValue || other instanceof TimeSpan))
		throw new Error("Invalid comparison type.  Must be of type TimeUnitValue or TimeSpan.");
}


function getMilliseconds(other:any):number
{
	if(other instanceof TimeUnitValue)
	{
		var o:TimeUnitValue = other;
		return o.type===TimeUnit.Milliseconds
			? o.value
			: o.toTimeSpan().milliseconds;
	}
	else if(other instanceof TimeSpan)
	{
		return other._milliseconds;
	}

	return undefined;
}

var timeSpanZero:TimeSpan;

export = TimeSpan;
