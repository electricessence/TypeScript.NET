/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports", '../Compare', '../Types', './HowMany', './TimeUnit', './TimeUnitValue', './ClockTime'], function (require, exports, Compare_1, Types_1, HowMany, TimeUnit_1, TimeUnitValue_1, ClockTime_1) {
    var TimeSpan = (function () {
        function TimeSpan(value, units) {
            if (units === void 0) { units = TimeUnit_1.default.Milliseconds; }
            this._milliseconds = TimeSpan.convertToMilliseconds(value, units);
        }
        TimeSpan.prototype.equals = function (other) {
            var otherMS = getMilliseconds(other);
            if (other === undefined)
                return false;
            return Compare_1.areEqual(this._milliseconds, otherMS);
        };
        TimeSpan.prototype.compareTo = function (other) {
            if (other == null)
                return 1 | 0;
            assertComparisonType(other);
            return Compare_1.compare(this._milliseconds, getMilliseconds(other));
        };
        TimeSpan.prototype.toTimeUnitValue = function (units) {
            if (units === void 0) { units = TimeUnit_1.default.Milliseconds; }
            return new TimeUnitValue_1.default(this.getTotal(units), units);
        };
        TimeSpan.convertToMilliseconds = function (value, units) {
            if (units === void 0) { units = TimeUnit_1.default.Milliseconds; }
            switch (units) {
                case TimeUnit_1.default.Days:
                    value *= 24;
                case TimeUnit_1.default.Hours:
                    value *= 60;
                case TimeUnit_1.default.Minutes:
                    value *= 60;
                case TimeUnit_1.default.Seconds:
                    value *= 1000;
                case TimeUnit_1.default.Milliseconds:
                    return value;
                case TimeUnit_1.default.Ticks:
                    return value / 10000;
                default:
                    throw new Error("Invalid TimeUnit.");
            }
        };
        TimeSpan.prototype.getTotal = function (units) {
            var _ = this;
            switch (units) {
                case TimeUnit_1.default.Days:
                    return _.days;
                case TimeUnit_1.default.Hours:
                    return _.hours;
                case TimeUnit_1.default.Minutes:
                    return _.minutes;
                case TimeUnit_1.default.Seconds:
                    return _.seconds;
                case TimeUnit_1.default.Milliseconds:
                    return _._milliseconds;
                case TimeUnit_1.default.Ticks:
                    return _._milliseconds * 10000;
                default:
                    throw new Error("Invalid TimeUnit.");
            }
        };
        Object.defineProperty(TimeSpan.prototype, "ticks", {
            get: function () {
                return this._milliseconds
                    * 10000;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "milliseconds", {
            get: function () {
                return this._milliseconds;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "seconds", {
            get: function () {
                return this._milliseconds
                    / 1000;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "minutes", {
            get: function () {
                return this.seconds
                    / 60;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "hours", {
            get: function () {
                return this.minutes
                    / 60;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "days", {
            get: function () {
                return this.hours
                    / 24;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "total", {
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "time", {
            get: function () {
                return new ClockTime_1.default(this._milliseconds);
            },
            enumerable: true,
            configurable: true
        });
        TimeSpan.prototype.add = function (other) {
            if (Types_1.default.isNumber(other))
                throw new Error("Use .addUnit to add a numerical value amount.  " +
                    ".add only supports ClockTime, TimeSpan, and TimeUnitValue.");
            if (other instanceof TimeUnitValue_1.default || other instanceof ClockTime_1.default)
                other = other.toTimeSpan();
            return new TimeSpan(this._milliseconds + other.milliseconds);
        };
        TimeSpan.prototype.addUnit = function (value, units) {
            if (units === void 0) { units = TimeUnit_1.default.Milliseconds; }
            return new TimeSpan(this._milliseconds + TimeSpan.convertToMilliseconds(value, units));
        };
        TimeSpan.from = function (value, units) {
            return new TimeSpan(value, units);
        };
        TimeSpan.fromDays = function (value) {
            return new TimeSpan(value, TimeUnit_1.default.Days);
        };
        TimeSpan.fromHours = function (value) {
            return new TimeSpan(value, TimeUnit_1.default.Hours);
        };
        TimeSpan.fromMinutes = function (value) {
            return new TimeSpan(value, TimeUnit_1.default.Minutes);
        };
        TimeSpan.fromSeconds = function (value) {
            return new TimeSpan(value, TimeUnit_1.default.Seconds);
        };
        TimeSpan.fromMilliseconds = function (value) {
            return new TimeSpan(value, TimeUnit_1.default.Milliseconds);
        };
        TimeSpan.fromTicks = function (value) {
            return new TimeSpan(value, TimeUnit_1.default.Ticks);
        };
        TimeSpan.fromTime = function (hours, minutes, seconds, milliseconds) {
            if (seconds === void 0) { seconds = 0; }
            if (milliseconds === void 0) { milliseconds = 0; }
            return new TimeSpan(TimeSpan.millisecondsFromTime(hours, minutes, seconds, milliseconds));
        };
        TimeSpan.millisecondsFromTime = function (hours, minutes, seconds, milliseconds) {
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
        TimeSpan.between = function (first, last) {
            return new TimeSpan(last.getTime() - first.getTime());
        };
        Object.defineProperty(TimeSpan, "zero", {
            get: function () {
                return timeSpanZero || (timeSpanZero = new TimeSpan(0));
            },
            enumerable: true,
            configurable: true
        });
        return TimeSpan;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TimeSpan;
    function assertComparisonType(other) {
        if (!(other instanceof TimeUnitValue_1.default || other instanceof TimeSpan))
            throw new Error("Invalid comparison type.  Must be of type TimeUnitValue or TimeSpan.");
    }
    function getMilliseconds(other) {
        if (other instanceof TimeUnitValue_1.default) {
            var o = other;
            return o.type === TimeUnit_1.default.Milliseconds
                ? o.value
                : o.toTimeSpan().milliseconds;
        }
        else if (other instanceof TimeSpan) {
            return other._milliseconds;
        }
        return undefined;
    }
    var timeSpanZero;
});
//# sourceMappingURL=TimeSpan.js.map