/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export interface ICalendarDate
{
	year:number;
	month:number;
	day:number;
}

export interface IClockTime
{
	hour:number;
	minute:number;
	second:number;
	millisecond:number;
	tick:number;
}

export interface ITimeStamp extends ICalendarDate, IClockTime
{

}

export default ITimeStamp;
