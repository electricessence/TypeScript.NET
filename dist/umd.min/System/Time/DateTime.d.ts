/*!
 * @author electricessence / https://github.com/electricessence/
 * Based on .NET DateTime's interface.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ICalendarDate, ITimeStamp } from "./ITimeStamp";
import { TimeSpan } from "./TimeSpan";
import { ClockTime } from "./ClockTime";
import { IDateTime } from "./IDateTime";
import { Gregorian } from "./Calendars";
import { ITimeQuantity } from "./ITimeQuantity";
export declare class DateTime implements ICalendarDate, IDateTime {
    private _value;
    toJsDate(): Date;
    private _setJsDate(value);
    constructor();
    constructor(dateString: string, kind?: DateTime.Kind);
    constructor(milliseconds: number, kind?: DateTime.Kind);
    constructor(source: Date, kind?: DateTime.Kind);
    constructor(source: DateTime, kind?: DateTime.Kind);
    private _kind;
    kind: DateTime.Kind;
    year: number;
    month: Gregorian.Month;
    day: number;
    dayOfWeek: Gregorian.DayOfWeek;
    addMilliseconds(ms: number): DateTime;
    addSeconds(seconds: number): DateTime;
    addMinutes(minutes: number): DateTime;
    addHours(hours: number): DateTime;
    addDays(days: number): DateTime;
    addMonths(months: number): DateTime;
    addYears(years: number): DateTime;
    add(time: ITimeQuantity): DateTime;
    subtract(time: ITimeQuantity): DateTime;
    timePassedSince(previous: Date | DateTime): TimeSpan;
    date: DateTime;
    private _time;
    timeOfDay: ClockTime;
    toTimeStamp(): ITimeStamp;
    static now: DateTime;
    toUniversalTime: DateTime;
    static today: DateTime;
    static tomorrow: DateTime;
    static between(first: Date | DateTime, last: Date | DateTime): TimeSpan;
    static isLeapYear(year: number): boolean;
    static daysInMonth(year: number, month: Gregorian.Month): number;
}
export declare module DateTime {
    const enum Kind {
        Unspecified = 0,
        Local = 1,
        Utc = 2,
    }
}
export default DateTime;
