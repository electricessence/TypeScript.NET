/// <reference path="../../../../source/System/Time/ITimeMeasurement.d.ts" />
/// <reference path="../../../../source/System/IEquatable.d.ts" />
/// <reference path="../../../../source/System/IComparable.d.ts" />
/// <reference path="../../../../gulp-tsc-tmp-116417-1120-6c8srr/System/Time/HowMany.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import TimeUnit from './TimeUnit';
import ClockTime from './ClockTime';
import TimeQuantity from './TimeQuantity';
export default class TimeSpan extends TimeQuantity implements ITimeMeasurement {
    ticks: number;
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    constructor(value: number, units?: TimeUnit);
    total: TimeSpan;
    private _time;
    time: ClockTime;
    add(other: ITimeQuantity): TimeSpan;
    addUnit(value: number, units?: TimeUnit): TimeSpan;
    static from(value: number, units: TimeUnit): TimeSpan;
    static fromDays(value: number): TimeSpan;
    static fromHours(value: number): TimeSpan;
    static fromMinutes(value: number): TimeSpan;
    static fromSeconds(value: number): TimeSpan;
    static fromMilliseconds(value: number): TimeSpan;
    static fromTicks(value: number): TimeSpan;
    static zero: TimeSpan;
}
