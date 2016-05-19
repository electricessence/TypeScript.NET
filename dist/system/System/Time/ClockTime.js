/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./TimeQuantity"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var TimeQuantity_1;
    var ClockTime;
    function pluralize(value, label) {
        if (Math.abs(value) !== 1)
            label += "s";
        return label;
    }
    return {
        setters:[
            function (TimeQuantity_1_1) {
                TimeQuantity_1 = TimeQuantity_1_1;
            }],
        execute: function() {
            ClockTime = (function (_super) {
                __extends(ClockTime, _super);
                function ClockTime() {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    _super.call(this, args.length > 1
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
                ClockTime.from = function (hours, minutes, seconds, milliseconds) {
                    if (seconds === void 0) { seconds = 0; }
                    if (milliseconds === void 0) { milliseconds = 0; }
                    return new ClockTime(hours, minutes, seconds, milliseconds);
                };
                ClockTime.millisecondsFromTime = function (hours, minutes, seconds, milliseconds) {
                    if (seconds === void 0) { seconds = 0; }
                    if (milliseconds === void 0) { milliseconds = 0; }
                    var value = hours;
                    value *= 60;
                    value += minutes;
                    value *= 60;
                    value += seconds;
                    value *= 1000;
                    value += milliseconds;
                    return value;
                };
                ClockTime.prototype.toString = function () {
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
                };
                return ClockTime;
            }(TimeQuantity_1.TimeQuantity));
            exports_1("ClockTime", ClockTime);
            exports_1("default",ClockTime);
        }
    }
});
//# sourceMappingURL=ClockTime.js.map