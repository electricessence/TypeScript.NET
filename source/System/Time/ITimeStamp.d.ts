/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

interface ICalendarDate {
	year:number;
	month:number;
	day:number;
}

interface IClockTime {
	hour:number;
	minute:number;
	second:number;
	millisecond:number;
	tick:number;
}

interface ITimeStamp extends ICalendarDate, IClockTime {

}
