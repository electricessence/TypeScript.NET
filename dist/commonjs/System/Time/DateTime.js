"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Based on .NET DateTime's interface.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TimeSpan_1 = require("./TimeSpan");
var ClockTime_1 = require("./ClockTime");
var TimeStamp_1 = require("./TimeStamp");
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var VOID0 = void 0;
var DateTime = /** @class */ (function () {
    function DateTime(value, kind) {
        if (value === void 0) { value = new Date(); }
        if (kind === void 0) { kind = DateTime.Kind.Local; }
        this._kind = kind;
        if (value instanceof DateTime) {
            this._value = value.toJsDate();
            if (kind === VOID0)
                this._kind = value._kind;
        }
        else { // noinspection SuspiciousInstanceOfGuard
            if (value instanceof Date)
                this._value = new Date(value.getTime());
            else
                this._value = value === VOID0
                    ? new Date()
                    : new Date(value);
        }
    }
    DateTime.prototype.toJsDate = function () {
        return new Date(this._value.getTime()); // return a clone.
    };
    Object.defineProperty(DateTime.prototype, "kind", {
        get: function () {
            return this._kind;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "year", {
        get: function () {
            return this._value.getFullYear();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "month", {
        /**
         * Returns the Gregorian Month (zero indexed).
         * @returns {number}
         */
        get: function () {
            return this._value.getMonth();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "calendarMonth", {
        /**
         * Returns the month number (1-12).
         * @returns {number}
         */
        get: function () {
            return this._value.getMonth() + 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "calendar", {
        get: function () {
            return {
                year: this.year,
                month: this.calendarMonth,
                day: this.day
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "day", {
        /**
         * Returns the day of the month.  An integer between 1 and 31.
         * @returns {number}
         */
        get: function () {
            return this._value.getDate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "dayIndex", {
        /**
         * Returns the day of the month indexed starting at zero.
         * @returns {number}
         */
        get: function () {
            return this._value.getDate() - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "dayOfWeek", {
        /**
         * Returns the zero indexed day of the week. (Sunday == 0)
         * @returns {number}
         */
        get: function () {
            return this._value.getDay();
        },
        enumerable: true,
        configurable: true
    });
    DateTime.prototype.addMilliseconds = function (ms) {
        ms = ms || 0;
        return new DateTime(this._value.getTime() + ms, this._kind);
    };
    DateTime.prototype.addSeconds = function (seconds) {
        seconds = seconds || 0;
        return this.addMilliseconds(seconds * 1000 /* Second */);
    };
    DateTime.prototype.addMinutes = function (minutes) {
        minutes = minutes || 0;
        return this.addMilliseconds(minutes * 60000 /* Minute */);
    };
    DateTime.prototype.addHours = function (hours) {
        hours = hours || 0;
        return this.addMilliseconds(hours * 3600000 /* Hour */);
    };
    DateTime.prototype.addDays = function (days) {
        days = days || 0;
        return this.addMilliseconds(days * 86400000 /* Day */);
    };
    DateTime.prototype.addMonths = function (months) {
        months = months || 0;
        var d = this.toJsDate();
        d.setMonth(d.getMonth() + months);
        return new DateTime(d, this._kind);
    };
    DateTime.prototype.addYears = function (years) {
        years = years || 0;
        var d = this.toJsDate();
        d.setFullYear(d.getFullYear() + years);
        return new DateTime(d, this._kind);
    };
    /**
     * Receives an ITimeQuantity value and adds based on the total milliseconds.
     * @param {ITimeQuantity} time
     * @returns {DateTime}
     */
    DateTime.prototype.add = function (time) {
        return this.addMilliseconds(time.getTotalMilliseconds());
    };
    /**
     * Receives an ITimeQuantity value and subtracts based on the total milliseconds.
     * @param {ITimeQuantity} time
     * @returns {DateTime}
     */
    DateTime.prototype.subtract = function (time) {
        return this.addMilliseconds(-time.getTotalMilliseconds());
    };
    /**
     * Returns a TimeSpan representing the amount of time between two dates.
     * @param previous
     * @returns {TimeSpan}
     */
    DateTime.prototype.timePassedSince = function (previous) {
        return DateTime.between(previous, this);
    };
    Object.defineProperty(DateTime.prototype, "date", {
        /**
         * Returns a DateTime object for 00:00 of this date.
         */
        get: function () {
            var _ = this;
            return new DateTime(new Date(_.year, _.month, _.day), _._kind);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "timeOfDay", {
        /**
         * Returns the time of day represented by a ClockTime object.
         * @returns {ClockTime}
         */
        get: function () {
            var _ = this;
            var t = _._time;
            if (!t) {
                var d = this._value;
                _._time = t = new ClockTime_1.ClockTime(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
            }
            return t;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a readonly object which contains all the date and time components.
     */
    DateTime.prototype.toTimeStamp = function () {
        return TimeStamp_1.TimeStamp.from(this);
    };
    Object.defineProperty(DateTime, "now", {
        /**
         * Returns the now local time.
         * @returns {DateTime}
         */
        get: function () {
            return new DateTime();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a UTC version of this date if its kind is local.
     * @returns {DateTime}
     */
    DateTime.prototype.toUniversalTime = function () {
        var _ = this;
        if (_._kind != DateTime.Kind.Local)
            return new DateTime(_, _._kind);
        var d = _._value;
        return new DateTime(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()), DateTime.Kind.Utc);
    };
    DateTime.prototype.equals = function (other, strict) {
        if (strict === void 0) { strict = false; }
        if (!other)
            return false;
        if (other == this)
            return true;
        if (other instanceof Date) {
            var v = this._value;
            return other == v || other.getTime() == v.getTime();
        }
        if (other instanceof DateTime) {
            if (strict) {
                var ok = other._kind;
                if (!ok && this._kind || ok != this._kind)
                    return false;
            }
            return this.equals(other._value);
        }
        else if (strict)
            return false;
        return this.equals(other.toJsDate());
    };
    // https://msdn.microsoft.com/en-us/library/System.IComparable.CompareTo(v=vs.110).aspx
    DateTime.prototype.compareTo = function (other) {
        if (!other)
            throw new ArgumentNullException_1.ArgumentNullException("other");
        if (other == this)
            return 0;
        if (other instanceof DateTime) {
            other = other._value;
        }
        var ms = this._value.getTime();
        if (other instanceof Date) {
            return ms - other.getTime();
        }
        return ms - other.toJsDate().getTime();
    };
    DateTime.prototype.equivalent = function (other) {
        if (!other)
            return false;
        if (other == this)
            return true;
        if (other instanceof Date) {
            var v = this._value;
            // TODO: What is the best way to handle this when kinds match or don't?
            return v.toUTCString() == other.toUTCString();
        }
        if (other instanceof DateTime) {
            if (this.equals(other, true))
                return true;
        }
        return this.equivalent(other.toJsDate());
    };
    Object.defineProperty(DateTime, "today", {
        /**
         * The date component for now.
         * @returns {DateTime}
         */
        get: function () {
            return DateTime.now.date;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime, "tomorrow", {
        /**
         * Midnight tomorrow.
         * @returns {DateTime}
         */
        get: function () {
            var today = DateTime.today;
            return today.addDays(1);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Measures the difference between two dates as a TimeSpan.
     * @param first
     * @param last
     */
    DateTime.between = function (first, last) {
        var f = first instanceof DateTime ? first._value : first, l = last instanceof DateTime ? last._value : last;
        return new TimeSpan_1.TimeSpan(l.getTime() - f.getTime());
    };
    /**
     * Calculates if the given year is a leap year using the formula:
     * ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)
     * @param year
     * @returns {boolean}
     */
    DateTime.isLeapYear = function (year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    };
    /**
     * Returns the number of days for the specific year and month.
     * @param year
     * @param month
     * @returns {any}
     */
    DateTime.daysInMonth = function (year, month) {
        // Basically, add 1 month, subtract a day... What's the date?
        return (new Date(year, month + 1, 0)).getDate();
    };
    DateTime.from = function (yearOrDate, month, day) {
        if (month === void 0) { month = 0; }
        if (day === void 0) { day = 1; }
        var year;
        if (typeof yearOrDate == "object") {
            day = yearOrDate.day;
            month = yearOrDate.month;
            year = yearOrDate.year;
        }
        else {
            year = yearOrDate;
        }
        return new DateTime(new Date(year, month, day));
    };
    DateTime.fromCalendarDate = function (yearOrDate, month, day) {
        if (month === void 0) { month = 1; }
        if (day === void 0) { day = 1; }
        var year;
        if (typeof yearOrDate == "object") {
            day = yearOrDate.day;
            month = yearOrDate.month;
            year = yearOrDate.year;
        }
        else {
            year = yearOrDate;
        }
        return new DateTime(new Date(year, month - 1, day));
    };
    return DateTime;
}());
exports.DateTime = DateTime;
// Extend DateTime's usefulness.
(function (DateTime) {
    var Kind;
    (function (Kind) {
        Kind[Kind["Unspecified"] = 0] = "Unspecified";
        Kind[Kind["Local"] = 1] = "Local";
        Kind[Kind["Utc"] = 2] = "Utc";
    })(Kind = DateTime.Kind || (DateTime.Kind = {}));
})(DateTime = exports.DateTime || (exports.DateTime = {}));
exports.DateTime = DateTime;
Object.freeze(DateTime);
exports.default = DateTime;
//# sourceMappingURL=DateTime.js.map