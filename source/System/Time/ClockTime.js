(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./TimeQuantity", "../../extends"], function (require, exports) {
    "use strict";
    var TimeQuantity_1 = require("./TimeQuantity");
    var extends_1 = require("../../extends");
    var __extends = extends_1.default;
    var ClockTime = (function (_super) {
        __extends(ClockTime, _super);
        function ClockTime() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var _this = _super.call(this, args.length > 1
                ? ClockTime.millisecondsFromTime(args[0] || 0, args[1] || 0, args.length > 2 && args[2] || 0, args.length > 3 && args[3] || 0)
                : (args.length > 0 && args[0] || 0)) || this;
            var ms = Math.abs(_this.getTotalMilliseconds());
            var msi = Math.floor(ms);
            _this.tick = (ms - msi) * 10000;
            _this.days = (msi / HowMany_1.Milliseconds.Per.Day) | 0;
            msi -= _this.days * HowMany_1.Milliseconds.Per.Day;
            _this.hour = (msi / HowMany_1.Milliseconds.Per.Hour) | 0;
            msi -= _this.hour * HowMany_1.Milliseconds.Per.Hour;
            _this.minute = (msi / HowMany_1.Milliseconds.Per.Minute) | 0;
            msi -= _this.minute * HowMany_1.Milliseconds.Per.Minute;
            _this.second = (msi / 1000) | 0;
            msi -= _this.second * 1000;
            _this.millisecond = msi;
            Object.freeze(_this);
            return _this;
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
    function pluralize(value, label) {
        if (Math.abs(value) !== 1)
            label += "s";
        return label;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ClockTime;
});
//# sourceMappingURL=ClockTime.js.map