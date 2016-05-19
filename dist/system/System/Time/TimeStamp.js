/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../Types"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1;
    var TimeStamp;
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            }],
        execute: function() {
            TimeStamp = (function () {
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
            exports_1("TimeStamp", TimeStamp);
            exports_1("default",TimeStamp);
        }
    }
});
//# sourceMappingURL=TimeStamp.js.map