/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Types"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var TimeStamp = (function () {
        function TimeStamp(year, month, day, hour, minute, second, millisecond, tick) {
            if (day === void 0) { day = 1; }
            if (hour === void 0) { hour = 0; }
            if (minute === void 0) { minute = 0; }
            if (second === void 0) { second = 0; }
            if (millisecond === void 0) { millisecond = 0; }
            if (tick === void 0) { tick = 0; }
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
        TimeStamp.prototype.toJsDate = function () {
            var _ = this;
            return new Date(_.year, _.month, _.day, _.hour, _.minute, _.second, _.millisecond + _.tick / 10000);
        };
        TimeStamp.from = function (d) {
            if (!(d instanceof Date) && Types_1.Type.hasMember(d, 'toJsDate'))
                d = d.toJsDate();
            if (d instanceof Date) {
                return new TimeStamp(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
            }
            else {
                throw Error('Invalid date type.');
            }
        };
        return TimeStamp;
    }());
    exports.TimeStamp = TimeStamp;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TimeStamp;
});
//# sourceMappingURL=TimeStamp.js.map