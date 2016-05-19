/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TimeQuantity } from "./TimeQuantity";
export class ClockTime extends TimeQuantity {
    constructor(...args) {
        super(args.length > 1
            ? ClockTime.millisecondsFromTime(args[0] || 0, args[1] || 0, args.length > 2 && args[2] || 0, args.length > 3 && args[3] || 0)
            : (args.length > 0 && args[0] || 0));
        var _ = this;
        var ms = Math.abs(_.getTotalMilliseconds());
        var msi = Math.floor(ms);
        _.tick = (ms - msi) * 10000;
        _.days = (msi / 86400000) | 0;
        msi -= _.days * 86400000;
        _.hour = (msi / 3600000) | 0;
        msi -= _.hour * 3600000;
        _.minute = (msi / 60000) | 0;
        msi -= _.minute * 60000;
        _.second = (msi / 1000) | 0;
        msi -= _.second * 1000;
        _.millisecond = msi;
        Object.freeze(_);
    }
    static from(hours, minutes, seconds = 0, milliseconds = 0) {
        return new ClockTime(hours, minutes, seconds, milliseconds);
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
    toString() {
        var _ = this, a = [];
        if (_.days)
            a.push(pluralize(_.days, "day"));
        if (_.hour)
            a.push(pluralize(_.hour, "hour"));
        if (_.minute)
            a.push(pluralize(_.minute, "minute"));
        if (_.second)
            a.push(pluralize(_.second, "second"));
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
export default ClockTime;
//# sourceMappingURL=ClockTime.js.map