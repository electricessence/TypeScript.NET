/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Types", "./TimeUnit", "./ClockTime", "./TimeQuantity"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var TimeUnit_1 = require("./TimeUnit");
    var ClockTime_1 = require("./ClockTime");
    var TimeQuantity_1 = require("./TimeQuantity");
    var TimeSpan = (function (_super) {
        __extends(TimeSpan, _super);
        function TimeSpan(value, units) {
            if (units === void 0) { units = TimeUnit_1.TimeUnit.Milliseconds; }
            var ms = TimeUnit_1.TimeUnit.toMilliseconds(value, units);
            _super.call(this, ms);
            var _ = this;
            _.ticks = ms * 10000;
            _.milliseconds = ms;
            _.seconds = ms / 1000;
            _.minutes = ms / 60000;
            _.hours = ms / 3600000;
            _.days = ms / 86400000;
        }
        Object.defineProperty(TimeSpan.prototype, "total", {
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "time", {
            get: function () {
                var _ = this, t = _._time;
                if (!t)
                    _._time = t = new ClockTime_1.ClockTime(_.getTotalMilliseconds());
                return t;
            },
            enumerable: true,
            configurable: true
        });
        TimeSpan.prototype.add = function (other) {
            if (Types_1.Type.isNumber(other))
                throw new Error("Use .addUnit(value:number,units:TimeUnit) to add a numerical value amount.  Default units are milliseconds.\n" +
                    ".add only supports quantifiable time values (ITimeTotal).");
            return new TimeSpan(this.getTotalMilliseconds() + other.total.milliseconds);
        };
        TimeSpan.prototype.addUnit = function (value, units) {
            if (units === void 0) { units = TimeUnit_1.TimeUnit.Milliseconds; }
            return new TimeSpan(this.getTotalMilliseconds() + TimeUnit_1.TimeUnit.toMilliseconds(value, units));
        };
        TimeSpan.from = function (value, units) {
            return new TimeSpan(value, units);
        };
        TimeSpan.fromDays = function (value) {
            return new TimeSpan(value, TimeUnit_1.TimeUnit.Days);
        };
        TimeSpan.fromHours = function (value) {
            return new TimeSpan(value, TimeUnit_1.TimeUnit.Hours);
        };
        TimeSpan.fromMinutes = function (value) {
            return new TimeSpan(value, TimeUnit_1.TimeUnit.Minutes);
        };
        TimeSpan.fromSeconds = function (value) {
            return new TimeSpan(value, TimeUnit_1.TimeUnit.Seconds);
        };
        TimeSpan.fromMilliseconds = function (value) {
            return new TimeSpan(value, TimeUnit_1.TimeUnit.Milliseconds);
        };
        TimeSpan.fromTicks = function (value) {
            return new TimeSpan(value, TimeUnit_1.TimeUnit.Ticks);
        };
        Object.defineProperty(TimeSpan, "zero", {
            get: function () {
                return timeSpanZero || (timeSpanZero = new TimeSpan(0));
            },
            enumerable: true,
            configurable: true
        });
        return TimeSpan;
    }(TimeQuantity_1.TimeQuantity));
    exports.TimeSpan = TimeSpan;
    var timeSpanZero;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TimeSpan;
});
//# sourceMappingURL=TimeSpan.js.map