"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../Types");
var TimeUnit_1 = require("./TimeUnit");
var ClockTime_1 = require("./ClockTime");
var TimeQuantity_1 = require("./TimeQuantity");
var extends_1 = require("../../extends");
var Lazy_1 = require("../Lazy");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
/**
 * TimeSpan expands on TimeQuantity to provide an class that is similar to .NET's TimeSpan including many useful static methods.
 */
var TimeSpan = /** @class */ (function (_super) {
    __extends(TimeSpan, _super);
    // In .NET the default type is Ticks, but for JavaScript, we will use Milliseconds.
    function TimeSpan(value, units) {
        if (units === void 0) { units = TimeUnit_1.TimeUnit.Milliseconds; }
        var _this = this;
        var ms = TimeUnit_1.TimeUnit.toMilliseconds(value, units);
        _this = _super.call(this, ms) || this;
        _this.ticks = ms * 10000 /* Millisecond */;
        _this.milliseconds = ms;
        _this.seconds = ms / 1000 /* Second */;
        _this.minutes = ms / 60000 /* Minute */;
        _this.hours = ms / 3600000 /* Hour */;
        _this.days = ms / 86400000 /* Day */;
        _this._time = Lazy_1.Lazy.create(function () { return new ClockTime_1.ClockTime(_this.getTotalMilliseconds()); });
        Object.freeze(_this);
        return _this;
    }
    Object.defineProperty(TimeSpan.prototype, "total", {
        /**
         * Provides an standard interface for acquiring the total time.
         * @returns {TimeSpan}
         */
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "time", {
        // Instead of the confusing getTotal versus unit name, expose a 'ClockTime' value which reports the individual components.
        get: function () {
            return this._time.value;
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
exports.default = TimeSpan;
//# sourceMappingURL=TimeSpan.js.map