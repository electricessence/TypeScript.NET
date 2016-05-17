/// <reference path="../../../../source/System/Time/ITimeMeasurement.d.ts" />
/// <reference path="../../../../source/System/Time/ITimeQuantity.d.ts" />
/// <reference path="../../../../source/System/IEquatable.d.ts" />
/// <reference path="../../../../source/System/IComparable.d.ts" />
/// <reference path="../../../../source/System/IFormattable.d.ts" />
/// <reference path="../../../../source/System/IFormatProvider.d.ts" />
/// <reference path="../../../../source/System/Time/ITimeStamp.d.ts" />
/// <reference path="../../../../gulp-tsc-tmp-116417-1120-1oukt1c/System/Time/HowMany.d.ts" />
import TimeQuantity from './TimeQuantity';
export default class ClockTime extends TimeQuantity implements IClockTime {
    days: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    tick: number;
    constructor(milliseconds: number);
    constructor(hours: number, minutes: number, seconds?: number, milliseconds?: number);
    static from(hours: number, minutes: number, seconds?: number, milliseconds?: number): ClockTime;
    static millisecondsFromTime(hours: number, minutes: number, seconds?: number, milliseconds?: number): number;
    toString(): string;
}
