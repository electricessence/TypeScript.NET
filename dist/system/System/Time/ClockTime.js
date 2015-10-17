/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['../Compare', './HowMany', './TimeSpan'], function(exports_1) {
    var Compare_1, HowMany, TimeSpan_1;
    var ClockTime;
    function pluralize(value, label) {
        if (Math.abs(value) !== 1)
            label += "s";
        return label;
    }
    return {
        setters:[
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            },
            function (HowMany_1) {
                HowMany = HowMany_1;
            },
            function (TimeSpan_1_1) {
                TimeSpan_1 = TimeSpan_1_1;
            }],
        execute: function() {
            ClockTime = (function () {
                function ClockTime() {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    this._totalMilliseconds =
                        args.length > 1
                            ? TimeSpan_1.default.millisecondsFromTime(args[0] || 0, args[1] || 0, args.length > 2 && args[2] || 0, args.length > 3 && args[3] || 0)
                            : (args.length > 0 && args[0] || 0);
                }
                Object.defineProperty(ClockTime.prototype, "totalMilliseconds", {
                    get: function () {
                        return this._totalMilliseconds;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ClockTime.prototype, "direction", {
                    get: function () {
                        return Compare_1.compare(this._totalMilliseconds, 0);
                    },
                    enumerable: true,
                    configurable: true
                });
                ClockTime.prototype.equals = function (other) {
                    return Compare_1.areEqual(this._totalMilliseconds, other.totalMilliseconds);
                };
                ClockTime.prototype.compareTo = function (other) {
                    if (other == null)
                        return 1 | 0;
                    return Compare_1.compare(this._totalMilliseconds, other.totalMilliseconds);
                };
                Object.defineProperty(ClockTime.prototype, "ticks", {
                    get: function () {
                        var _ = this, r = _._ticks;
                        if (r === undefined) {
                            var ms = Math.abs(_._totalMilliseconds);
                            _._ticks = r = (ms - Math.floor(ms)) * 10000;
                        }
                        return r;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ClockTime.prototype, "milliseconds", {
                    get: function () {
                        var _ = this, r = _._ms;
                        if (r === undefined)
                            _._ms = r =
                                (this._totalMilliseconds % 3600000) | 0;
                        return r;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ClockTime.prototype, "seconds", {
                    get: function () {
                        var _ = this, r = _._seconds;
                        if (r === undefined)
                            _._seconds = r =
                                ((this._totalMilliseconds / 3600000) % 60) | 0;
                        return r;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ClockTime.prototype, "minutes", {
                    get: function () {
                        var _ = this, r = _._minutes;
                        if (r === undefined)
                            _._minutes = r =
                                ((this._totalMilliseconds
                                    / 3600000
                                    / 60) % 60) | 0;
                        return r;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ClockTime.prototype, "hours", {
                    get: function () {
                        var _ = this, r = _._hours;
                        if (r === undefined)
                            _._hours = r =
                                ((this._totalMilliseconds
                                    / 3600000
                                    / 60
                                    / 60) % 24) | 0;
                        return r;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ClockTime.prototype, "days", {
                    get: function () {
                        var _ = this, r = _._days;
                        if (r === undefined)
                            _._days = r =
                                (this._totalMilliseconds
                                    / 3600000
                                    / 60
                                    / 60
                                    / 24) | 0;
                        return r;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ClockTime.prototype, "total", {
                    get: function () {
                        return this.toTimeSpan();
                    },
                    enumerable: true,
                    configurable: true
                });
                ClockTime.prototype.toTimeSpan = function () {
                    return new TimeSpan_1.default(this._totalMilliseconds);
                };
                ClockTime.from = function (hours, minutes, seconds, milliseconds) {
                    if (seconds === void 0) { seconds = 0; }
                    if (milliseconds === void 0) { milliseconds = 0; }
                    return new ClockTime(hours, minutes, seconds, milliseconds);
                };
                ClockTime.prototype.toString = function () {
                    /* INSERT CUSTOM FORMATTING CODE HERE */
                    var _ = this, a = [];
                    if (_.days)
                        a.push(pluralize(_.days, "day"));
                    if (_.hours)
                        a.push(pluralize(_.hours, "hour"));
                    if (_.minutes)
                        a.push(pluralize(_.minutes, "minute"));
                    if (_.seconds)
                        a.push(pluralize(_.seconds, "second"));
                    if (a.length > 1)
                        a.splice(a.length - 1, 0, "and");
                    return a.join(", ").replace(", and, ", " and ");
                };
                return ClockTime;
            })();
            exports_1("default", ClockTime);
        }
    }
});
//# sourceMappingURL=ClockTime.js.map