"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var TimeQuantity_1 = require("./TimeQuantity");
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var ClockTime = (function (_super) {
    __extends(ClockTime, _super);
    function ClockTime() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        _super.call(this, args.length > 1
            ? ClockTime.millisecondsFromTime(args[0] || 0, args[1] || 0, args.length > 2 && args[2] || 0, args.length > 3 && args[3] || 0)
            : (args.length > 0 && args[0] || 0));
        var ms = Math.abs(this.getTotalMilliseconds());
        var msi = Math.floor(ms);
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
    ClockTime.from = function (hours, minutes, seconds, milliseconds) {
        if (seconds === void 0) { seconds = 0; }
        if (milliseconds === void 0) { milliseconds = 0; }
        return new ClockTime(hours, minutes, seconds, milliseconds);
    };
    ClockTime.millisecondsFromTime = function (hours, minutes, seconds, milliseconds) {
        if (seconds === void 0) { seconds = 0; }
        if (milliseconds === void 0) { milliseconds = 0; }
        var value = hours;
        value *= 60 /* Hour */;
        value += minutes;
        value *= 60 /* Minute */;
        value += seconds;
        value *= 1000 /* Second */;
        value += milliseconds;
        return value;
    };
    ClockTime.prototype.toString = function () {
        /* INSERT CUSTOM FORMATTING CODE HERE */
        var _ = this;
        var a = [];
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
exports.ClockTime = ClockTime;
// Temporary until the full TimeSpanFormat is available.
function pluralize(value, label) {
    if (Math.abs(value) !== 1)
        label += "s";
    return label;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClockTime;