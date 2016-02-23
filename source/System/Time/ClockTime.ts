///<reference path="ITimeMeasurement.d.ts"/>
///<reference path="ITimeQuantity.d.ts"/>
///<reference path="../IEquatable.d.ts"/>
///<reference path="../IComparable.d.ts"/>
///<reference path="../IFormattable.d.ts"/>
///<reference path="../IFormatProvider.d.ts"/>
///<reference path="ITimeStamp.d.ts"/>
///<reference path="HowMany.ts"/>
/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict'; // For compatibility with (let, const, function, class);

import {areEqual,compare} from '../Compare';
import TimeQuantity from './TimeQuantity';


export default
class ClockTime extends TimeQuantity implements IClockTime
{

	days:number;
	hour:number;
	minute:number;
	second:number;
	millisecond:number;
	tick:number;

	constructor(milliseconds:number);
	constructor(hours:number, minutes:number, seconds?:number, milliseconds?:number);
	constructor(...args:number[])
	{
		super(
			args.length>1
				? ClockTime.millisecondsFromTime(
				args[0] || 0,
				args[1] || 0,
				args.length>2 && args[2] || 0,
				args.length>3 && args[3] || 0
			)
				: (args.length>0 && args[0] || 0)
		);

		var _ = this;
		var ms = Math.abs(_.getTotalMilliseconds());
		var msi = Math.floor(ms);

		_.tick = (ms - msi)*HowMany.Ticks.Per.Millisecond;

		_.days = (msi/HowMany.Milliseconds.Per.Day) | 0;
		msi -= _.days * HowMany.Milliseconds.Per.Day;

		_.hour = (msi/HowMany.Milliseconds.Per.Hour) | 0;
		msi -= _.hour * HowMany.Milliseconds.Per.Hour;

		_.minute = (msi/HowMany.Milliseconds.Per.Minute) | 0;
		msi -= _.minute * HowMany.Milliseconds.Per.Minute;

		_.second = (msi/HowMany.Milliseconds.Per.Second) | 0;
		msi -= _.second * HowMany.Milliseconds.Per.Second;

		_.millisecond = msi;

		Object.freeze(_);
	}


	// Static version for relative consistency.  Constructor does allow this format.
	static from(hours:number, minutes:number, seconds:number = 0, milliseconds:number = 0):ClockTime
	{
		return new ClockTime(hours, minutes, seconds, milliseconds);
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

	toString(/*format?:string, formatProvider?:IFormatProvider*/):string
	{
		/* INSERT CUSTOM FORMATTING CODE HERE */


		var _ = this, a:string[] = [];

		if(_.days)
			a.push(pluralize(_.days, "day"));

		if(_.hour)
			a.push(pluralize(_.hour, "hour"));

		if(_.minute)
			a.push(pluralize(_.minute, "minute"));

		if(_.second)
			a.push(pluralize(_.second, "second"));

		if(a.length>1)
			a.splice(a.length - 1, 0, "and");

		return a.join(", ").replace(", and, ", " and ");
	}

}


// Temporary until the full TimeSpanFormat is available.
function pluralize(value:number, label:string):string
{
	if(Math.abs(value)!==1)
		label += "s";

	return label;
}
