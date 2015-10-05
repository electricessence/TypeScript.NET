/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports", '../Compare', '../Types', './TimeUnit', './HowMany', './TimeUnitValue', './ClockTime'], function (require, exports, Values, Types, TimeUnit, HowMany, TimeUnitValue, ClockTime) {
    var TimeSpan = (function () {
        function TimeSpan(value, units) {
            if (units === void 0) { units = TimeUnit.Milliseconds; }
            this._milliseconds = TimeSpan.convertToMilliseconds(value, units);
        }
        TimeSpan.prototype.equals = function (other) {
            var otherMS = getMilliseconds(other);
            if (other === undefined)
                return false;
            return Values.areEqual(this._milliseconds, otherMS);
        };
        TimeSpan.prototype.compareTo = function (other) {
            if (other == null)
                return 1 | 0;
            assertComparisonType(other);
            return Values.compare(this._milliseconds, getMilliseconds(other));
        };
        TimeSpan.prototype.toTimeUnitValue = function (units) {
            if (units === void 0) { units = TimeUnit.Milliseconds; }
            return new TimeUnitValue(this.getTotal(units), units);
        };
        TimeSpan.convertToMilliseconds = function (value, units) {
            if (units === void 0) { units = TimeUnit.Milliseconds; }
            switch (units) {
                case TimeUnit.Days:
                    value *= 24;
                case TimeUnit.Hours:
                    value *= 60;
                case TimeUnit.Minutes:
                    value *= 60;
                case TimeUnit.Seconds:
                    value *= 1000;
                case TimeUnit.Milliseconds:
                    return value;
                case TimeUnit.Ticks:
                    return value / 10000;
                default:
                    throw new Error("Invalid TimeUnit.");
            }
        };
        TimeSpan.prototype.getTotal = function (units) {
            var _ = this;
            switch (units) {
                case TimeUnit.Days:
                    return _.days;
                case TimeUnit.Hours:
                    return _.hours;
                case TimeUnit.Minutes:
                    return _.minutes;
                case TimeUnit.Seconds:
                    return _.seconds;
                case TimeUnit.Milliseconds:
                    return _._milliseconds;
                case TimeUnit.Ticks:
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
                return new ClockTime(this._milliseconds);
            },
            enumerable: true,
            configurable: true
        });
        TimeSpan.prototype.add = function (other) {
            if (Types.isNumber(other))
                throw new Error("Use .addUnit to add a numerical value amount.  " +
                    ".add only supports ClockTime, TimeSpan, and TimeUnitValue.");
            if (other instanceof TimeUnitValue || other instanceof ClockTime)
                other = other.toTimeSpan();
            return new TimeSpan(this._milliseconds + other.milliseconds);
        };
        TimeSpan.prototype.addUnit = function (value, units) {
            if (units === void 0) { units = TimeUnit.Milliseconds; }
            return new TimeSpan(this._milliseconds + TimeSpan.convertToMilliseconds(value, units));
        };
        TimeSpan.from = function (value, units) {
            return new TimeSpan(value, units);
        };
        TimeSpan.fromDays = function (value) {
            return new TimeSpan(value, TimeUnit.Days);
        };
        TimeSpan.fromHours = function (value) {
            return new TimeSpan(value, TimeUnit.Hours);
        };
        TimeSpan.fromMinutes = function (value) {
            return new TimeSpan(value, TimeUnit.Minutes);
        };
        TimeSpan.fromSeconds = function (value) {
            return new TimeSpan(value, TimeUnit.Seconds);
        };
        TimeSpan.fromMilliseconds = function (value) {
            return new TimeSpan(value, TimeUnit.Milliseconds);
        };
        TimeSpan.fromTicks = function (value) {
            return new TimeSpan(value, TimeUnit.Ticks);
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
    function assertComparisonType(other) {
        if (!(other instanceof TimeUnitValue || other instanceof TimeSpan))
            throw new Error("Invalid comparison type.  Must be of type TimeUnitValue or TimeSpan.");
    }
    function getMilliseconds(other) {
        if (other instanceof TimeUnitValue) {
            var o = other;
            return o.type === TimeUnit.Milliseconds
                ? o.value
                : o.toTimeSpan().milliseconds;
        }
        else if (other instanceof TimeSpan) {
            return other._milliseconds;
        }
        return undefined;
    }
    var timeSpanZero;
    return TimeSpan;
});
//# sourceMappingURL=TimeSpan.js.map