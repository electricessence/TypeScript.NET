import { TimeUnit } from "./TimeUnit";
import { ClockTime } from "./ClockTime";
import { TimeQuantity } from "./TimeQuantity";
import { ITimeMeasurement } from "./ITimeMeasurement";
import { ITimeQuantity } from "./ITimeQuantity";
/**
 * TimeSpan expands on TimeQuantity to provide an class that is similar to .NET's TimeSpan including many useful static methods.
 */
export declare class TimeSpan extends TimeQuantity implements ITimeMeasurement {
    ticks: number;
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    constructor(value: number, units?: TimeUnit);
    /**
     * Provides an standard interface for acquiring the total time.
     * @returns {TimeSpan}
     */
    readonly total: TimeSpan;
    private _time;
    readonly time: ClockTime;
    add(other: ITimeQuantity): TimeSpan;
    addUnit(value: number, units?: TimeUnit): TimeSpan;
    static from(value: number, units: TimeUnit): TimeSpan;
    static fromDays(value: number): TimeSpan;
    static fromHours(value: number): TimeSpan;
    static fromMinutes(value: number): TimeSpan;
    static fromSeconds(value: number): TimeSpan;
    static fromMilliseconds(value: number): TimeSpan;
    static fromTicks(value: number): TimeSpan;
    static readonly zero: TimeSpan;
}
export default TimeSpan;
