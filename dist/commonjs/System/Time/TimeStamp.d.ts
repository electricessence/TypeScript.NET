/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ITimeStamp } from "./ITimeStamp";
import { IDateTime } from "./IDateTime";
import { Gregorian } from "./Calendars";
export declare class TimeStamp implements ITimeStamp, IDateTime {
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
export default TimeStamp;
