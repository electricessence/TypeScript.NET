/*!
 * @author electricessence / https://github.com/electricessence/
 * Based on .NET DateTime's interface.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TimeSpan } from "./TimeSpan";
import { ClockTime } from "./ClockTime";
import { TimeStamp } from "./TimeStamp";
export class DateTime {
    constructor(value = new Date(), kind = 1) {
        var _ = this;
        _._kind = kind;
        if (value instanceof DateTime)
            _._value = value.toJsDate();
        else if (value instanceof Date)
            _._setJsDate(value);
        else
            _._value = value === void (0)
                ? new Date()
                : new Date(value);
    }
    toJsDate() {
        return new Date(this._value.getTime());
    }
    _setJsDate(value) {
        this._time = null;
        this._value = new Date(value.getTime());
    }
    get kind() {
        return this._kind;
    }
    get year() {
        return this._value.getFullYear();
    }
    get month() {
        return this._value.getMonth();
    }
    get day() {
        return this._value.getDate();
    }
    get dayOfWeek() {
        return this._value.getDay();
    }
    addMilliseconds(ms) {
        ms = ms || 0;
        return new DateTime(this._value.getTime() + ms, this._kind);
    }
    addSeconds(seconds) {
        seconds = seconds || 0;
        return this.addMilliseconds(seconds * 1000);
    }
    addMinutes(minutes) {
        minutes = minutes || 0;
        return this.addMilliseconds(minutes * 60000);
    }
    addHours(hours) {
        hours = hours || 0;
        return this.addMilliseconds(hours * 3600000);
    }
    addDays(days) {
        days = days || 0;
        return this.addMilliseconds(days * 86400000);
    }
    addMonths(months) {
        months = months || 0;
        var d = this.toJsDate();
        d.setMonth(d.getMonth() + months);
        return new DateTime(d, this._kind);
    }
    addYears(years) {
        years = years || 0;
        var d = this.toJsDate();
        d.setFullYear(d.getFullYear() + years);
        return new DateTime(d, this._kind);
    }
    add(time) {
        return this.addMilliseconds(time.getTotalMilliseconds());
    }
    subtract(time) {
        return this.addMilliseconds(-time.getTotalMilliseconds());
    }
    timePassedSince(previous) {
        return DateTime.between(previous, this);
    }
    get date() {
        var _ = this;
        return new DateTime(new Date(_.year, _.month, _.day), _._kind);
    }
    get timeOfDay() {
        var _ = this, t = _._time;
        if (!t) {
            var d = this._value;
            _._time = t = new ClockTime(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
        }
        return t;
    }
    toTimeStamp() {
        return TimeStamp.from(this);
    }
    static get now() {
        return new DateTime();
    }
    get toUniversalTime() {
        var _ = this;
        if (_._kind != 1)
            return new DateTime(_, _._kind);
        var d = _._value;
        return new DateTime(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()), 2);
    }
    static get today() {
        return DateTime.now.date;
    }
    static get tomorrow() {
        var today = DateTime.today;
        return today.addDays(1);
    }
    static between(first, last) {
        var f = first instanceof DateTime ? first._value : first, l = last instanceof DateTime ? last._value : last;
        return new TimeSpan(f.getTime() - l.getTime());
    }
    static isLeapYear(year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }
    static daysInMonth(year, month) {
        return (new Date(year, month + 1, 0)).getDate();
    }
}
Object.freeze(DateTime);
export default DateTime;
//# sourceMappingURL=DateTime.js.map