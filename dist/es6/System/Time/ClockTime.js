/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TimeQuantity } from "./TimeQuantity";
// noinspection JSUnusedLocalSymbols
export class ClockTime extends TimeQuantity {
    constructor(...args) {
        super(args.length > 1
            ? ClockTime.millisecondsFromTime(args[0] || 0, args[1] || 0, args.length > 2 && args[2] || 0, args.length > 3 && args[3] || 0)
            : (args.length > 0 && args[0] || 0));
        const ms = Math.abs(this.getTotalMilliseconds());
        let msi = Math.floor(ms);
        this.tick = (ms - msi) * 10000 /* Millisecond */;
        this.days = (msi / 86400000 /* Day */) | 0;
        msi -= this.days * 86400000 /* Day */;
        this.hour = (msi / 3600000 /* Hour */) | 0;
        msi -= this.hour * 3600000 /* Hour */;
        this.minute = (msi / 60000 /* Minute */) | 0;
        msi -= this.minute * 60000 /* Minute */;
        this.second = (msi / 1000 /* Second */) | 0;
        msi -= this.second * 1000 /* Second */;
        this.millisecond = msi;
        Object.freeze(this);
    }
    // Static version for relative consistency.  Constructor does allow this format.
    static from(hours, minutes, seconds = 0, milliseconds = 0) {
        return new ClockTime(hours, minutes, seconds, milliseconds);
    }
    static millisecondsFromTime(hours, minutes, seconds = 0, milliseconds = 0) {
        let value = hours;
        value *= 60 /* Hour */;
        value += minutes;
        value *= 60 /* Minute */;
        value += seconds;
        value *= 1000 /* Second */;
        value += milliseconds;
        return value;
    }
    toString() {
        /* INSERT CUSTOM FORMATTING CODE HERE */
        const _ = this;
        const a = [];
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
// Temporary until the full TimeSpanFormat is available.
function pluralize(value, label) {
    if (Math.abs(value) !== 1)
        label += "s";
    return label;
}
export default ClockTime;
//# sourceMappingURL=ClockTime.js.map