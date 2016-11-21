System.register(["./TimeSpan", "./ClockTime", "./TimeStamp"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TimeSpan_1, ClockTime_1, TimeStamp_1, DateTime;
    return {
        setters: [
            function (TimeSpan_1_1) {
                TimeSpan_1 = TimeSpan_1_1;
            },
            function (ClockTime_1_1) {
                ClockTime_1 = ClockTime_1_1;
            },
            function (TimeStamp_1_1) {
                TimeStamp_1 = TimeStamp_1_1;
            }
        ],
        execute: function () {
            DateTime = (function () {
                function DateTime(value, kind) {
                    if (value === void 0) { value = new Date(); }
                    if (kind === void 0) { kind = 1 /* Local */; }
                    var _ = this;
                    this._kind = kind;
                    if (value instanceof DateTime)
                        this._value = value.toJsDate();
                    else if (value instanceof Date)
                        this._value = new Date(value.getTime());
                    else
                        this._value = value === void (0)
                            ? new Date()
                            : new Date(value);
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
                Object.defineProperty(DateTime.prototype, "toUniversalTime", {
                    /**
                     * Returns a UTC version of this date if its kind is local.
                     * @returns {DateTime}
                     */
                    get: function () {
                        var _ = this;
                        if (_._kind != 1 /* Local */)
                            return new DateTime(_, _._kind);
                        var d = _._value;
                        return new DateTime(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()), 2 /* Utc */);
                    },
                    enumerable: true,
                    configurable: true
                });
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
            exports_1("DateTime", DateTime);
            Object.freeze(DateTime);
            exports_1("default", DateTime);
        }
    };
});
//# sourceMappingURL=DateTime.js.map