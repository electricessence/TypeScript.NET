/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
'use strict';
define(["require", "exports", '../System', '../Types', './HowMany', './TimeUnit', './TimeUnitValue', './ClockTime'], function (require, exports, System, Types, HowMany, TimeUnit, TimeUnitValue, ClockTime) {
    var TimeSpan = (function () {
        // In .NET the default type is Ticks, but for JavaScript, we will use Milliseconds.
        function TimeSpan(value, units) {
            if (units === void 0) { units = TimeUnit.Milliseconds; }
            this._milliseconds = TimeSpan.convertToMilliseconds(value, units);
        }
        TimeSpan.prototype.equals = function (other) {
            var otherMS = getMilliseconds(other);
            if (other === undefined)
                return false;
            return System.areEqual(this._milliseconds, otherMS);
        };
        TimeSpan.prototype.compareTo = function (other) {
            if (other == null)
                return 1 | 0;
            assertComparisonType(other);
            return System.compare(this._milliseconds, getMilliseconds(other));
        };
        TimeSpan.prototype.toTimeUnitValue = function (units) {
            if (units === void 0) { units = TimeUnit.Milliseconds; }
            return new TimeUnitValue(this.total(units), units);
        };
        TimeSpan.convertToMilliseconds = function (value, units) {
            if (units === void 0) { units = TimeUnit.Milliseconds; }
            // noinspection FallThroughInSwitchStatementJS
            switch (units) {
                case TimeUnit.Days:
                    value *= HowMany.Hours.Per.Day;
                case TimeUnit.Hours:
                    value *= HowMany.Minutes.Per.Hour;
                case TimeUnit.Minutes:
                    value *= HowMany.Seconds.Per.Minute;
                case TimeUnit.Seconds:
                    value *= HowMany.Milliseconds.Per.Second;
                case TimeUnit.Milliseconds:
                    return value;
                case TimeUnit.Ticks:
                    return value / HowMany.Ticks.Per.Millisecond;
                default:
                    throw new Error("Invalid TimeUnit.");
            }
        };
        TimeSpan.prototype.total = function (units) {
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
                    return _._milliseconds * HowMany.Ticks.Per.Millisecond;
                default:
                    throw new Error("Invalid TimeUnit.");
            }
        };
        Object.defineProperty(TimeSpan.prototype, "ticks", {
            get: function () {
                return this._milliseconds * HowMany.Ticks.Per.Millisecond;
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
                return this._milliseconds / HowMany.Milliseconds.Per.Second;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "minutes", {
            get: function () {
                return this.seconds / HowMany.Seconds.Per.Minute;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "hours", {
            get: function () {
                return this.minutes / HowMany.Minutes.Per.Hour;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "days", {
            get: function () {
                return this.hours / HowMany.Hours.Per.Day;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeSpan.prototype, "time", {
            // Instead of the confusing total versus unit name, expose a 'ClockTime' value which reports the individual components.
            get: function () {
                return new ClockTime(this._milliseconds);
            },
            enumerable: true,
            configurable: true
        });
        TimeSpan.prototype.add = function (other) {
            if (Types.isNumber(other))
                throw new Error("Use .addUnit to add a numerical value amount.  .add only supports ClockTime, TimeSpan, and TimeUnitValue.");
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
            value *= HowMany.Minutes.Per.Hour;
            value += minutes;
            value *= HowMany.Seconds.Per.Minute;
            value += seconds;
            value *= HowMany.Milliseconds.Per.Second;
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