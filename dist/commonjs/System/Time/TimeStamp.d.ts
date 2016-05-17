/// <reference path="../../../../source/System/Time/ITimeStamp.d.ts" />
/// <reference path="../../../../source/System/Time/IDateTime.d.ts" />
/// <reference path="../../../../source/System/Time/Calendars.d.ts" />
/// <reference path="../../../../gulp-tsc-tmp-116417-4216-cwoz0m/System/Time/HowMany.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export default class TimeStamp implements ITimeStamp, IDateTime {
    year: number;
    month: Gregorian.Month;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    tick: number;
    constructor(year: number, month: Gregorian.Month, day?: number, hour?: number, minute?: number, second?: number, millisecond?: number, tick?: number);
    toJsDate(): Date;
    static from(d: Date | IDateTime): TimeStamp;
}
