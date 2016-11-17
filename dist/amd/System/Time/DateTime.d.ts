import { ICalendarDate, ITimeStamp } from "./ITimeStamp";
import { TimeSpan } from "./TimeSpan";
import { ClockTime } from "./ClockTime";
import { IDateTime } from "./IDateTime";
import { Gregorian } from "./Calendars";
import { ITimeQuantity } from "./ITimeQuantity";
export declare class DateTime implements ICalendarDate, IDateTime {
    private readonly _value;
    toJsDate(): Date;
    constructor();
    constructor(dateString: string, kind?: DateTime.Kind);
    constructor(milliseconds: number, kind?: DateTime.Kind);
    constructor(source: Date, kind?: DateTime.Kind);
    constructor(source: DateTime, kind?: DateTime.Kind);
    private readonly _kind;
    readonly kind: DateTime.Kind;
    readonly year: number;
    readonly month: Gregorian.Month;
    readonly calendarMonth: number;
    readonly calendar: ICalendarDate;
    readonly day: number;
    readonly dayIndex: number;
    readonly dayOfWeek: Gregorian.DayOfWeek;
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
    readonly date: DateTime;
    private _time;
    readonly timeOfDay: ClockTime;
    toTimeStamp(): ITimeStamp;
    static readonly now: DateTime;
    readonly toUniversalTime: DateTime;
    static readonly today: DateTime;
    static readonly tomorrow: DateTime;
    static between(first: Date | DateTime, last: Date | DateTime): TimeSpan;
    static isLeapYear(year: number): boolean;
    static daysInMonth(year: number, month: Gregorian.Month): number;
    static from(calendarDate: ICalendarDate): DateTime;
    static from(year: number, month: Gregorian.Month, day: number): DateTime;
    static fromCalendarDate(calendarDate: ICalendarDate): DateTime;
    static fromCalendarDate(year: number, month: number, day: number): DateTime;
}
export declare module DateTime {
    const enum Kind {
        Unspecified = 0,
        Local = 1,
        Utc = 2,
    }
}
export default DateTime;
