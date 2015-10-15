/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as HowMany from './HowMany';
export default class DateTime {
    constructor(value = new Date()) {
        var _ = this;
        if (value instanceof DateTime)
            _._value = value.jsDate;
        else if (value instanceof Date)
            _.setJsDate(value);
        else
            _._value = value == undefined
                ? new Date()
                : new Date(value);
    }
    get jsDate() {
        return new Date(this._value.getTime());
    }
    setJsDate(value) {
        this._value = new Date(value.getTime());
    }
    addMilliseconds(ms) {
        ms = ms || 0;
        return new DateTime(this._value.getTime() + ms);
    }
    addDays(days) {
        days = days || 0;
        return this.addMilliseconds(days * 86400000);
    }
    add(time) {
        return this.addMilliseconds(time.total.milliseconds);
    }
    static now() {
        return new DateTime();
    }
    static today() {
        var now = new Date();
        return new DateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    }
    static tomorrow() {
        var today = DateTime.today();
        return today.addDays(1);
    }
    static daysAgo(days) {
        var today = DateTime.today();
        return today.addDays(-days);
    }
}
Object.freeze(DateTime);
//# sourceMappingURL=DateTime.js.map