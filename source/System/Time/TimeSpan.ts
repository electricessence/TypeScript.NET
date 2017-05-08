/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Type} from "../Types";
import {TimeUnit} from "./TimeUnit";
import {ClockTime} from "./ClockTime";
import {TimeQuantity} from "./TimeQuantity";
import {Milliseconds, Ticks} from "./HowMany";
import {ITimeMeasurement} from "./ITimeMeasurement";
import {ITimeQuantity} from "./ITimeQuantity";
import __extendsImport from "../../extends";
import {Lazy} from "../Lazy";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;


/**
 * TimeSpan expands on TimeQuantity to provide an class that is similar to .NET's TimeSpan including many useful static methods.
 */
export class TimeSpan extends TimeQuantity implements ITimeMeasurement
{
	/**
	 * The total number of ticks that represent this amount of time.
	 */
	readonly ticks:number;

	/**
	 * The total number of ticks that milliseconds this amount of time.
	 */
	readonly milliseconds:number;

	/**
	 * The total number of ticks that seconds this amount of time.
	 */
	readonly seconds:number;

	/**
	 * The total number of ticks that minutes this amount of time.
	 */
	readonly minutes:number;

	/**
	 * The total number of ticks that hours this amount of time.
	 */
	readonly hours:number;

	/**
	 * The total number of ticks that days this amount of time.
	 */
	readonly days:number;

	// In .NET the default type is Ticks, but for JavaScript, we will use Milliseconds.
	constructor(value:number, units:TimeUnit = TimeUnit.Milliseconds)
	{
		const ms = TimeUnit.toMilliseconds(value, units);
		super(ms);

		this.ticks = ms*Ticks.Per.Millisecond;
		this.milliseconds = ms;
		this.seconds = ms/Milliseconds.Per.Second;
		this.minutes = ms/Milliseconds.Per.Minute;
		this.hours = ms/Milliseconds.Per.Hour;
		this.days = ms/Milliseconds.Per.Day;

		this._time = Lazy.create(()=> new ClockTime(this.getTotalMilliseconds()));

		Object.freeze(this);
	}

	/**
	 * Provides an standard interface for acquiring the total time.
	 * @returns {TimeSpan}
	 */
	get total():TimeSpan
	{
		return this;
	}

	private _time:Lazy<ClockTime>;
	// Instead of the confusing getTotal versus unit name, expose a 'ClockTime' value which reports the individual components.
	get time():ClockTime
	{
		return this._time.value;
	}

	add(other:ITimeQuantity):TimeSpan
	{
		if(Type.isNumber(other))
			throw new Error(
				"Use .addUnit(value:number,units:TimeUnit) to add a numerical value amount.  Default units are milliseconds.\n" +
				".add only supports quantifiable time values (ITimeTotal)."
			);

		return new TimeSpan(this.getTotalMilliseconds() + other.total.milliseconds);
	}

	addUnit(value:number, units:TimeUnit = TimeUnit.Milliseconds):TimeSpan
	{
		return new TimeSpan(this.getTotalMilliseconds() + TimeUnit.toMilliseconds(value, units));
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


	static get zero():TimeSpan
	{
		return timeSpanZero || (timeSpanZero = new TimeSpan(0));
	}
}


let timeSpanZero:TimeSpan;

export default TimeSpan;