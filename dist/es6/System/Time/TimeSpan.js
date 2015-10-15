/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual, compare } from '../Compare';
import Type from '../Types';
import * as HowMany from './HowMany';
import TimeUnit from './TimeUnit';
import TimeUnitValue from './TimeUnitValue';
import ClockTime from './ClockTime';
export default class TimeSpan {
    constructor(value, units = TimeUnit.Milliseconds) {
        this._milliseconds = TimeSpan.convertToMilliseconds(value, units);
    }
    equals(other) {
        var otherMS = getMilliseconds(other);
        if (other === undefined)
            return false;
        return areEqual(this._milliseconds, otherMS);
    }
    compareTo(other) {
        if (other == null)
            return 1 | 0;
        assertComparisonType(other);
        return compare(this._milliseconds, getMilliseconds(other));
    }
    toTimeUnitValue(units = TimeUnit.Milliseconds) {
        return new TimeUnitValue(this.getTotal(units), units);
    }
    static convertToMilliseconds(value, units = TimeUnit.Milliseconds) {
        switch (units) {
            case TimeUnit.Days:
                value *= 24;
            case TimeUnit.Hours:
                value *= 60;
            case TimeUnit.Minutes:
                value *= 60;
            case TimeUnit.Seconds:
                value *= 1000;
            case TimeUnit.Milliseconds:
                return value;
            case TimeUnit.Ticks:
                return value / 10000;
            default:
                throw new Error("Invalid TimeUnit.");
        }
    }
    getTotal(units) {
        var _ = this;
        switch (units) {
            case TimeUnit.Days:
                return _.days;
            case TimeUnit.Hours:
                return _.hours;
            case TimeUnit.Minutes:
                return _.minutes;
            case TimeUnit.Seconds:
                return _.seconds;
            case TimeUnit.Milliseconds:
                return _._milliseconds;
            case TimeUnit.Ticks:
                return _._milliseconds * 10000;
            default:
                throw new Error("Invalid TimeUnit.");
        }
    }
    get ticks() {
        return this._milliseconds
            * 10000;
    }
    get milliseconds() {
        return this._milliseconds;
    }
    get seconds() {
        return this._milliseconds
            / 1000;
    }
    get minutes() {
        return this.seconds
            / 60;
    }
    get hours() {
        return this.minutes
            / 60;
    }
    get days() {
        return this.hours
            / 24;
    }
    get total() {
        return this;
    }
    get time() {
        return new ClockTime(this._milliseconds);
    }
    add(other) {
        if (Type.isNumber(other))
            throw new Error("Use .addUnit to add a numerical value amount.  " +
                ".add only supports ClockTime, TimeSpan, and TimeUnitValue.");
        if (other instanceof TimeUnitValue || other instanceof ClockTime)
            other = other.toTimeSpan();
        return new TimeSpan(this._milliseconds + other.milliseconds);
    }
    addUnit(value, units = TimeUnit.Milliseconds) {
        return new TimeSpan(this._milliseconds + TimeSpan.convertToMilliseconds(value, units));
    }
    static from(value, units) {
        return new TimeSpan(value, units);
    }
    static fromDays(value) {
        return new TimeSpan(value, TimeUnit.Days);
    }
    static fromHours(value) {
        return new TimeSpan(value, TimeUnit.Hours);
    }
    static fromMinutes(value) {
        return new TimeSpan(value, TimeUnit.Minutes);
    }
    static fromSeconds(value) {
        return new TimeSpan(value, TimeUnit.Seconds);
    }
    static fromMilliseconds(value) {
        return new TimeSpan(value, TimeUnit.Milliseconds);
    }
    static fromTicks(value) {
        return new TimeSpan(value, TimeUnit.Ticks);
    }
    static fromTime(hours, minutes, seconds = 0, milliseconds = 0) {
        return new TimeSpan(TimeSpan.millisecondsFromTime(hours, minutes, seconds, milliseconds));
    }
    static millisecondsFromTime(hours, minutes, seconds = 0, milliseconds = 0) {
        var value = hours;
        value *= 60;
        value += minutes;
        value *= 60;
        value += seconds;
        value *= 1000;
        value += milliseconds;
        return value;
    }
    static between(first, last) {
        return new TimeSpan(last.getTime() - first.getTime());
    }
    static get zero() {
        return timeSpanZero || (timeSpanZero = new TimeSpan(0));
    }
}
function assertComparisonType(other) {
    if (!(other instanceof TimeUnitValue || other instanceof TimeSpan))
        throw new Error("Invalid comparison type.  Must be of type TimeUnitValue or TimeSpan.");
}
function getMilliseconds(other) {
    if (other instanceof TimeUnitValue) {
        var o = other;
        return o.type === TimeUnit.Milliseconds
            ? o.value
            : o.toTimeSpan().milliseconds;
    }
    else if (other instanceof TimeSpan) {
        return other._milliseconds;
    }
    return undefined;
}
var timeSpanZero;
//# sourceMappingURL=TimeSpan.js.map