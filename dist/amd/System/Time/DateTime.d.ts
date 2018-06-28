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
import { IEquatable } from "../IEquatable";
import { IComparable } from "../IComparable";
export declare class DateTime implements ICalendarDate, IDateTime, IEquatable<IDateTime>, IComparable<IDateTime> {
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
    /**
     * Returns the Gregorian Month (zero indexed).
     * @returns {number}
     */
    readonly month: Gregorian.Month;
    /**
     * Returns the month number (1-12).
     * @returns {number}
     */
    readonly calendarMonth: number;
    readonly calendar: ICalendarDate;
    /**
     * Returns the day of the month.  An integer between 1 and 31.
     * @returns {number}
     */
    readonly day: number;
    /**
     * Returns the day of the month indexed starting at zero.
     * @returns {number}
     */
    readonly dayIndex: number;
    /**
     * Returns the zero indexed day of the week. (Sunday == 0)
     * @returns {number}
     */
    readonly dayOfWeek: Gregorian.DayOfWeek;
    addMilliseconds(ms: number): DateTime;
    addSeconds(seconds: number): DateTime;
    addMinutes(minutes: number): DateTime;
    addHours(hours: number): DateTime;
    addDays(days: number): DateTime;
    addMonths(months: number): DateTime;
    addYears(years: number): DateTime;
    /**
     * Receives an ITimeQuantity value and adds based on the total milliseconds.
     * @param {ITimeQuantity} time
     * @returns {DateTime}
     */
    add(time: ITimeQuantity): DateTime;
    /**
     * Receives an ITimeQuantity value and subtracts based on the total milliseconds.
     * @param {ITimeQuantity} time
     * @returns {DateTime}
     */
    subtract(time: ITimeQuantity): DateTime;
    /**
     * Returns a TimeSpan representing the amount of time between two dates.
     * @param previous
     * @returns {TimeSpan}
     */
    timePassedSince(previous: Date | DateTime): TimeSpan;
    /**
     * Returns a DateTime object for 00:00 of this date.
     */
    readonly date: DateTime;
    private _time;
    /**
     * Returns the time of day represented by a ClockTime object.
     * @returns {ClockTime}
     */
    readonly timeOfDay: ClockTime;
    /**
     * Returns a readonly object which contains all the date and time components.
     */
    toTimeStamp(): ITimeStamp;
    /**
     * Returns the now local time.
     * @returns {DateTime}
     */
    static readonly now: DateTime;
    /**
     * Returns a UTC version of this date if its kind is local.
     * @returns {DateTime}
     */
    toUniversalTime(): DateTime;
    /**
     * Compares a JS Date with the current instance.  Does not evaluate the kind.
     * @param other
     * @returns {boolean}
     */
    equals(other: Date): boolean;
    /**
     * Compares another IDateTime object and returns true if they or their value are equal.
     * @param other The other IDateTime object.
     * @param strict When strict is true, the 'kind' also must match.
     * @returns {boolean}
     */
    equals(other: IDateTime, strict?: boolean): boolean;
    compareTo(other: IDateTime | Date): number;
    equivalent(other: IDateTime | Date): boolean;
    /**
     * The date component for now.
     * @returns {DateTime}
     */
    static readonly today: DateTime;
    /**
     * Midnight tomorrow.
     * @returns {DateTime}
     */
    static readonly tomorrow: DateTime;
    /**
     * Measures the difference between two dates as a TimeSpan.
     * @param first
     * @param last
     */
    static between(first: Date | DateTime, last: Date | DateTime): TimeSpan;
    /**
     * Calculates if the given year is a leap year using the formula:
     * ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)
     * @param year
     * @returns {boolean}
     */
    static isLeapYear(year: number): boolean;
    /**
     * Returns the number of days for the specific year and month.
     * @param year
     * @param month
     * @returns {any}
     */
    static daysInMonth(year: number, month: Gregorian.Month): number;
    static from(calendarDate: ICalendarDate): DateTime;
    static from(year: number, month: Gregorian.Month, day: number): DateTime;
    static fromCalendarDate(calendarDate: ICalendarDate): DateTime;
    static fromCalendarDate(year: number, month: number, day: number): DateTime;
}
export declare module DateTime {
    enum Kind {
        Unspecified = 0,
        Local = 1,
        Utc = 2
    }
}
export default DateTime;
