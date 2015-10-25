/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path='ITimeQuantity.d.ts'/>
///<reference path="ICalendarDate.d.ts"/>
import * as HowMany from './HowMany';
import ClockTime from './ClockTime';
import TimeSpan from './TimeSpan';


class DateTime implements ICalendarDate
{
	private _value:Date;

	get jsDate():Date
	{
		return new Date(this._value.getTime()); // return a clone.
	}

	private _setJsDate(value:Date)
	{
		this._time = null;
		this._value = new Date(value.getTime());
	}

	constructor();
	constructor(dateString:string, kind?:DateTime.Kind);
	constructor(milliseconds:number, kind?:DateTime.Kind);
	constructor(source:Date, kind?:DateTime.Kind);
	constructor(source:DateTime, kind?:DateTime.Kind);
	constructor(value:any = new Date(), kind:DateTime.Kind = DateTime.Kind.Local)
	{
		var _ = this;
		_._kind = kind;
		if(value instanceof DateTime)
			_._value = value.jsDate;
		else if(value instanceof Date)
			_._setJsDate(value);
		else
			_._value = value==undefined
				? new Date()
				: new Date(value);
	}

	private _kind:DateTime.Kind;
	get kind():DateTime.Kind
	{
		return this._kind;
	}

	get year():number
	{
		return this._value.getFullYear();
	}

	get month():number
	{
		return this._value.getMonth();
	}

	/**
	 * An integer between 1 and 31.
	 * @returns {number}
	 */
	get day():number
	{
		return this._value.getDate();
	}

	get dayOfWeek():DateTime.DayOfWeek
	{
		return this._value.getDay();
	}


	addMilliseconds(ms:number):DateTime
	{
		ms = ms || 0;
		return new DateTime(this._value.getTime() + ms, this._kind);
	}

	addSeconds(seconds:number):DateTime
	{
		seconds = seconds || 0;
		return this.addMilliseconds(seconds*HowMany.Milliseconds.Per.Second);
	}

	addMinutes(minutes:number):DateTime
	{
		minutes = minutes || 0;
		return this.addMilliseconds(minutes*HowMany.Milliseconds.Per.Minute);
	}

	addHours(hours:number):DateTime
	{
		hours = hours || 0;
		return this.addMilliseconds(hours*HowMany.Milliseconds.Per.Hour);
	}

	addDays(days:number):DateTime
	{
		days = days || 0;
		return this.addMilliseconds(days*HowMany.Milliseconds.Per.Day);
	}

	addMonths(months:number):DateTime
	{
		months = months || 0;
		var d = this.jsDate;
		d.setMonth(d.getMonth()+months);
		return new DateTime(d, this._kind);
	}

	addYears(years:number):DateTime
	{
		years = years || 0;
		var d = this.jsDate;
		d.setFullYear(d.getFullYear()+years);
		return new DateTime(d, this._kind);
	}


	/**
	 * Receives an ITimeQuantity value and adds based on the total milliseconds.
	 * @param {ITimeQuantity} time
	 * @returns {DateTime}
	 */
	add(time:ITimeQuantity):DateTime
	{
		return this.addMilliseconds(time.getTotalMilliseconds());
	}

	/**
	 * Returns a DateTime object for 00:00 of this date.
	 */
	get date():DateTime
	{
		var _ = this;
		return new DateTime(
			new Date(
				_.year,
				_.month,
				_.day
			)
			, _._kind
		);
	}

	private _time:ClockTime;

	get timeOfDay():ClockTime
	{
		var _ = this, t = _._time;
		if(!t)
		{
			var d = this._value;
			_._time = t = new ClockTime(
				d.getHours(),
				d.getMinutes(),
				d.getSeconds(),
				d.getMilliseconds());
		}
		return t;
	}


	static get now():DateTime
	{
		return new DateTime();
	}

	get utc():DateTime
	{
		var _ = this;
		if(_._kind!=DateTime.Kind.Local)
			return new DateTime(_, _._kind);

		var d = _._value;
		return new DateTime(
			new Date(
				d.getUTCFullYear(),
				d.getUTCMonth(),
				d.getUTCDate(),
				d.getUTCHours(),
				d.getUTCMinutes(),
				d.getUTCSeconds(),
				d.getUTCMilliseconds()
			),
			DateTime.Kind.Utc
		);
	}

	static get today():DateTime
	{
		return DateTime.now.date;
	}

	static get tomorrow():DateTime
	{
		var today:DateTime = DateTime.today;
		return today.addDays(1);
	}

	static between(first:Date|DateTime, last:Date|DateTime):TimeSpan
	{
		var f:Date = first instanceof DateTime ? first._value : <Date>first,
		    l:Date = last instanceof DateTime ? last._value : <Date>last;

		return new TimeSpan(f.getTime() - l.getTime());
	}

	timePassedSince(previous:Date|DateTime):TimeSpan
	{
		return DateTime.between(previous, this);
	}

}

module DateTime
{
	export const enum DayOfWeek {
		Sunday,
		Monday,
		Tuesday,
		Wednesday,
		Thursday,
		Friday,
		Saturday
	}

	export const enum Kind {
		Unspecified,
		Local,
		Utc,
	}
}

Object.freeze(DateTime);

export default DateTime;
