/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../Types", "./TimeUnit", "./ClockTime", "./TimeQuantity"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Types_1, TimeUnit_1, ClockTime_1, TimeQuantity_1;
    var TimeSpan, timeSpanZero;
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (TimeUnit_1_1) {
                TimeUnit_1 = TimeUnit_1_1;
            },
            function (ClockTime_1_1) {
                ClockTime_1 = ClockTime_1_1;
            },
            function (TimeQuantity_1_1) {
                TimeQuantity_1 = TimeQuantity_1_1;
            }],
        execute: function() {
            TimeSpan = (function (_super) {
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
            exports_1("TimeSpan", TimeSpan);
            exports_1("default",TimeSpan);
        }
    }
});
//# sourceMappingURL=TimeSpan.js.map