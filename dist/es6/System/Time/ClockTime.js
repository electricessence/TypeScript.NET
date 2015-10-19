/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual, compare } from '../Compare';
import * as HowMany from './HowMany';
import TimeSpan from './TimeSpan';
export default class ClockTime {
    constructor(...args) {
        this._totalMilliseconds =
            args.length > 1
                ? TimeSpan.millisecondsFromTime(args[0] || 0, args[1] || 0, args.length > 2 && args[2] || 0, args.length > 3 && args[3] || 0)
                : (args.length > 0 && args[0] || 0);
    }
    get totalMilliseconds() {
        return this._totalMilliseconds;
    }
    get direction() {
        return compare(this._totalMilliseconds, 0);
    }
    equals(other) {
        return areEqual(this._totalMilliseconds, other.totalMilliseconds);
    }
    compareTo(other) {
        if (other == null)
            return 1 | 0;
        return compare(this._totalMilliseconds, other.totalMilliseconds);
    }
    get ticks() {
        var _ = this, r = _._ticks;
        if (r === undefined) {
            var ms = Math.abs(_._totalMilliseconds);
            _._ticks = r = (ms - Math.floor(ms)) * 10000;
        }
        return r;
    }
    get milliseconds() {
        var _ = this, r = _._ms;
        if (r === undefined)
            _._ms = r =
                (this._totalMilliseconds % 3600000) | 0;
        return r;
    }
    get seconds() {
        var _ = this, r = _._seconds;
        if (r === undefined)
            _._seconds = r =
                ((this._totalMilliseconds / 3600000) % 60) | 0;
        return r;
    }
    get minutes() {
        var _ = this, r = _._minutes;
        if (r === undefined)
            _._minutes = r =
                ((this._totalMilliseconds
                    / 3600000
                    / 60) % 60) | 0;
        return r;
    }
    get hours() {
        var _ = this, r = _._hours;
        if (r === undefined)
            _._hours = r =
                ((this._totalMilliseconds
                    / 3600000
                    / 60
                    / 60) % 24) | 0;
        return r;
    }
    get days() {
        var _ = this, r = _._days;
        if (r === undefined)
            _._days = r =
                (this._totalMilliseconds
                    / 3600000
                    / 60
                    / 60
                    / 24) | 0;
        return r;
    }
    get total() {
        return this.toTimeSpan();
    }
    toTimeSpan() {
        return new TimeSpan(this._totalMilliseconds);
    }
    static from(hours, minutes, seconds = 0, milliseconds = 0) {
        return new ClockTime(hours, minutes, seconds, milliseconds);
    }
    toString() {
        /* INSERT CUSTOM FORMATTING CODE HERE */
        var _ = this, a = [];
        if (_.days)
            a.push(pluralize(_.days, "day"));
        if (_.hours)
            a.push(pluralize(_.hours, "hour"));
        if (_.minutes)
            a.push(pluralize(_.minutes, "minute"));
        if (_.seconds)
            a.push(pluralize(_.seconds, "second"));
        if (a.length > 1)
            a.splice(a.length - 1, 0, "and");
        return a.join(", ").replace(", and, ", " and ");
    }
}
function pluralize(value, label) {
    if (Math.abs(value) !== 1)
        label += "s";
    return label;
}
//# sourceMappingURL=ClockTime.js.map