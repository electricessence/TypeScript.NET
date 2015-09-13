/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

"use strict";

///<reference path="ITimeMeasurement.ts"/>
///<reference path="../IEquatable.ts"/>
///<reference path="../IComparable.ts"/>
import System = require('../System');
import Types = require('../Types');
import TimeUnit = require('TimeUnit');
import TimeUnitValue = require('TimeUnitValue');
import ClockTime = require('ClockTime');

const
	ticksPerMillisecond = 10000,
	msPerSecond = 1000,
	secondsPerMinute = 60,
	minutesPerHour = 60,
	earthHoursPerDay = 24;

class TimeSpan implements ITimeMeasurement, IEquatable<TimeSpan>, IComparable<TimeSpan>
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
		var otherms:number = getMilliseconds(other);

		if(other===undefined) // undefined is used instead of NaN since NaN could be a valid value.
			return false;

		return System.areEqual(this._milliseconds, otherms);
	}


	compareTo(other:TimeUnitValue):number;
	compareTo(other:TimeSpan):number;
	compareTo(other:any):number
	{
		if(other==null) return 1 | 0;

		assertComparisonType(other);

		return System.compare(this._milliseconds, getMilliseconds(other));

	}

	toTimeUnitValue(units:TimeUnit = TimeUnit.Milliseconds):TimeUnitValue
	{
		return new TimeUnitValue(this.total(units), units);
	}

	static convertToMilliseconds(value:number, units:TimeUnit = TimeUnit.Milliseconds):number
	{
		// noinspection FallThroughInSwitchStatementJS
		switch(units) {
			case TimeUnit.Days:
				value *= earthHoursPerDay;
			case TimeUnit.Hours:
				value *= minutesPerHour;
			case TimeUnit.Minutes:
				value *= secondsPerMinute;
			case TimeUnit.Seconds:
				value *= msPerSecond;
			case TimeUnit.Milliseconds:
				return value;
			case TimeUnit.Ticks:
				return value/ticksPerMillisecond;
			default:
				throw new Error("Invalid TimeUnit.");
		}
	}

	total(units:TimeUnit):number
	{
		var _ = this;
		switch(units) {
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
				return _._milliseconds*ticksPerMillisecond;
			default:
				throw new Error("Invalid TimeUnit.");
		}
	}

	get ticks():number
	{
		return this._milliseconds*ticksPerMillisecond;
	}

	get milliseconds():number
	{
		return this._milliseconds;
	}

	get seconds():number
	{
		return this._milliseconds/msPerSecond;
	}

	get minutes():number
	{
		return this.seconds/secondsPerMinute;
	}

	get hours():number
	{
		return this.minutes/minutesPerHour;
	}

	get days():number
	{
		return this.hours/earthHoursPerDay;
	}

	// Instead of the confusing total versus unit name, expose a 'ClockTime' value which reports the individual components.
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
			throw new Error("Use .addUnit to add a numerical value amount.  .add only supports ClockTime, TimeSpan, and TimeUnitValue.");
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

	static fromTime(hours:number, minutes:number, seconds:number = 0, milliseconds:number = 0):TimeSpan
	{
		return new TimeSpan(TimeSpan.millisecondsFromTime(hours, minutes, seconds, milliseconds));
	}

	static millisecondsFromTime(hours:number, minutes:number, seconds:number = 0, milliseconds:number = 0):number
	{
		var value = hours;
		value *= minutesPerHour;
		value += minutes;
		value *= secondsPerMinute;
		value += seconds;
		value *= msPerSecond;
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


// Temporary until the full TimeSpanFormat is available.
function pluralize(value:number, label:string):string
{
	if(Math.abs(value)!==1)
		label += "s";

	return label;
}


function assertValidUnit(unit:TimeUnit):boolean
{
	if(isNaN(unit) || unit>TimeUnit.Days || unit<TimeUnit.Ticks || Math.floor(unit)!==unit)
		throw new Error("Invalid TimeUnit.");

	return true;
}


function assertComparisonType(other:any):void
{
	if(!(other instanceof TimeUnitValue || other instanceof TimeSpan))
		throw new Error("Invalid comparison type.  Must be of type TimeUnitValue or TimeSpan.");
}

function getMilliseconds(other:any):number
{
	if(other instanceof TimeUnitValue) {
		var o:TimeUnitValue = other;
		return o.type===TimeUnit.Milliseconds
			? o.value
			: o.toTimeSpan().milliseconds;
	}
	else if(other instanceof TimeSpan) {
		return other._milliseconds;
	}

	return undefined;
}

var timeSpanZero:TimeSpan;

export = TimeSpan;
