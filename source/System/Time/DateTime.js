/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './HowMany', './ClockTime', './TimeSpan'], function (require, exports) {
    ///<reference path='ITimeQuantity.d.ts'/>
    ///<reference path="ICalendarDate.d.ts"/>
    var HowMany = require('./HowMany');
    var ClockTime_1 = require('./ClockTime');
    var TimeSpan_1 = require('./TimeSpan');
    var DateTime = (function () {
        function DateTime(value, kind) {
            if (value === void 0) { value = new Date(); }
            if (kind === void 0) { kind = 1; }
            var _ = this;
            _._kind = kind;
            if (value instanceof DateTime)
                _._value = value.jsDate;
            else if (value instanceof Date)
                _._setJsDate(value);
            else
                _._value = value == undefined
                    ? new Date()
                    : new Date(value);
        }
        Object.defineProperty(DateTime.prototype, "jsDate", {
            get: function () {
                return new Date(this._value.getTime());
            },
            enumerable: true,
            configurable: true
        });
        DateTime.prototype._setJsDate = function (value) {
            this._time = null;
            this._value = new Date(value.getTime());
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
            get: function () {
                return this._value.getMonth();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "day", {
            get: function () {
                return this._value.getDate();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "dayOfWeek", {
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
            return this.addMilliseconds(seconds * 1000);
        };
        DateTime.prototype.addMinutes = function (minutes) {
            minutes = minutes || 0;
            return this.addMilliseconds(minutes * 60000);
        };
        DateTime.prototype.addHours = function (hours) {
            hours = hours || 0;
            return this.addMilliseconds(hours * 3600000);
        };
        DateTime.prototype.addDays = function (days) {
            days = days || 0;
            return this.addMilliseconds(days * 86400000);
        };
        DateTime.prototype.add = function (time) {
            return this.addMilliseconds(time.total.milliseconds);
        };
        Object.defineProperty(DateTime.prototype, "date", {
            get: function () {
                var _ = this;
                return new DateTime(new Date(_.year, _.month, _.day), _._kind);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "timeOfDay", {
            get: function () {
                var _ = this, t = _._time;
                if (!t) {
                    var d = this._value;
                    _._time = t = new ClockTime_1.default(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
                }
                return t;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime, "now", {
            get: function () {
                return new DateTime();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "utc", {
            get: function () {
                var _ = this;
                if (_._kind != 1)
                    return new DateTime(_, _._kind);
                var d = _._value;
                return new DateTime(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()), 2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime, "today", {
            get: function () {
                return DateTime.now.date;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime, "tomorrow", {
            get: function () {
                var today = DateTime.today;
                return today.addDays(1);
            },
            enumerable: true,
            configurable: true
        });
        DateTime.between = function (first, last) {
            var f = first instanceof DateTime ? first._value : first, l = last instanceof DateTime ? last._value : last;
            return new TimeSpan_1.default(f.getTime() - l.getTime());
        };
        DateTime.prototype.timePassedSince = function (previous) {
            return DateTime.between(previous, this);
        };
        return DateTime;
    })();
    Object.freeze(DateTime);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DateTime;
});
//# sourceMappingURL=DateTime.js.map