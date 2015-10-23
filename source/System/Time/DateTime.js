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
})(["require", "exports", './HowMany', './ClockTime'], function (require, exports) {
    ///<reference path='ITimeTotal.d.ts'/>
    var HowMany = require('./HowMany');
    var ClockTime_1 = require('./ClockTime');
    var DateTime = (function () {
        function DateTime(value) {
            if (value === void 0) { value = new Date(); }
            var _ = this;
            if (value instanceof DateTime)
                _._value = value.jsDate;
            else if (value instanceof Date)
                _.setJsDate(value);
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
        DateTime.prototype.setJsDate = function (value) {
            this._value = new Date(value.getTime());
        };
        DateTime.prototype.addMilliseconds = function (ms) {
            ms = ms || 0;
            return new DateTime(this._value.getTime() + ms);
        };
        DateTime.prototype.addDays = function (days) {
            days = days || 0;
            return this.addMilliseconds(days * 86400000);
        };
        DateTime.prototype.add = function (time) {
            return this.addMilliseconds(time.total.milliseconds);
        };
        Object.defineProperty(DateTime.prototype, "timeOfDay", {
            get: function () {
                var d = this._value;
                return new ClockTime_1.default(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
            },
            enumerable: true,
            configurable: true
        });
        DateTime.now = function () {
            return new DateTime();
        };
        DateTime.today = function () {
            var now = new Date();
            return new DateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
        };
        DateTime.tomorrow = function () {
            var today = DateTime.today();
            return today.addDays(1);
        };
        return DateTime;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DateTime;
    Object.freeze(DateTime);
});
//# sourceMappingURL=DateTime.js.map