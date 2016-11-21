/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../Types";
/**
 * An alternative to Date or DateTime.  Is a model representing the exact date and time.
 */
export class TimeStamp {
    constructor(year, month, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0, tick = 0) {
        // Add validation or properly carry out of range values?
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.millisecond = millisecond;
        this.tick = tick;
        Object.freeze(this);
    }
    toJsDate() {
        const _ = this;
        return new Date(_.year, _.month, _.day, _.hour, _.minute, _.second, _.millisecond + _.tick / 10000 /* Millisecond */);
    }
    static from(d) {
        if (!(d instanceof Date) && Type.hasMember(d, 'toJsDate'))
            d = d.toJsDate();
        if (d instanceof Date) {
            return new TimeStamp(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
        }
        else {
            throw Error('Invalid date type.');
        }
    }
}
export default TimeStamp;
//# sourceMappingURL=TimeStamp.js.map