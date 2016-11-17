import { TimeQuantity } from "./TimeQuantity";
export class ClockTime extends TimeQuantity {
    constructor(...args) {
        super(args.length > 1
            ? ClockTime.millisecondsFromTime(args[0] || 0, args[1] || 0, args.length > 2 && args[2] || 0, args.length > 3 && args[3] || 0)
            : (args.length > 0 && args[0] || 0));
        const ms = Math.abs(this.getTotalMilliseconds());
        let msi = Math.floor(ms);
        this.tick = (ms - msi) * 10000;
        this.days = (msi / 86400000) | 0;
        msi -= this.days * 86400000;
        this.hour = (msi / 3600000) | 0;
        msi -= this.hour * 3600000;
        this.minute = (msi / 60000) | 0;
        msi -= this.minute * 60000;
        this.second = (msi / 1000) | 0;
        msi -= this.second * 1000;
        this.millisecond = msi;
        Object.freeze(this);
    }
    static from(hours, minutes, seconds = 0, milliseconds = 0) {
        return new ClockTime(hours, minutes, seconds, milliseconds);
    }
    static millisecondsFromTime(hours, minutes, seconds = 0, milliseconds = 0) {
        let value = hours;
        value *= 60;
        value += minutes;
        value *= 60;
        value += seconds;
        value *= 1000;
        value += milliseconds;
        return value;
    }
    toString() {
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
function pluralize(value, label) {
    if (Math.abs(value) !== 1)
        label += "s";
    return label;
}
export default ClockTime;
//# sourceMappingURL=ClockTime.js.map