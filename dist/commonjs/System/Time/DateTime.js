/*
 * @author electricessence / https://github.com/electricessence/
 * Based on .NET DateTime's interface.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Types = require('../Types');

var _Types2 = _interopRequireDefault(_Types);

var _HowMany = require('./HowMany');

var HowMany = _interopRequireWildcard(_HowMany);

var _ClockTime = require('./ClockTime');

var _ClockTime2 = _interopRequireDefault(_ClockTime);

var _TimeSpan = require('./TimeSpan');

var _TimeSpan2 = _interopRequireDefault(_TimeSpan);

var _TimeStamp = require('./TimeStamp');

var _TimeStamp2 = _interopRequireDefault(_TimeStamp);

var DateTime = (function () {
    function DateTime() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? new Date() : arguments[0];
        var kind = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

        _classCallCheck(this, DateTime);

        var _ = this;
        _._kind = kind;
        if (_Types2['default'].isInstanceOf(value, DateTime)) _._value = value.toJsDate();else if (_Types2['default'].isInstanceOf(value, Date)) _._setJsDate(value);else _._value = value == undefined ? new Date() : new Date(value);
    }

    _createClass(DateTime, [{
        key: 'toJsDate',
        value: function toJsDate() {
            return new Date(this._value.getTime());
        }
    }, {
        key: '_setJsDate',
        value: function _setJsDate(value) {
            this._time = null;
            this._value = new Date(value.getTime());
        }
    }, {
        key: 'addMilliseconds',
        value: function addMilliseconds(ms) {
            ms = ms || 0;
            return new DateTime(this._value.getTime() + ms, this._kind);
        }
    }, {
        key: 'addSeconds',
        value: function addSeconds(seconds) {
            seconds = seconds || 0;
            return this.addMilliseconds(seconds * 1000);
        }
    }, {
        key: 'addMinutes',
        value: function addMinutes(minutes) {
            minutes = minutes || 0;
            return this.addMilliseconds(minutes * 60000);
        }
    }, {
        key: 'addHours',
        value: function addHours(hours) {
            hours = hours || 0;
            return this.addMilliseconds(hours * 3600000);
        }
    }, {
        key: 'addDays',
        value: function addDays(days) {
            days = days || 0;
            return this.addMilliseconds(days * 86400000);
        }
    }, {
        key: 'addMonths',
        value: function addMonths(months) {
            months = months || 0;
            var d = this.toJsDate();
            d.setMonth(d.getMonth() + months);
            return new DateTime(d, this._kind);
        }
    }, {
        key: 'addYears',
        value: function addYears(years) {
            years = years || 0;
            var d = this.toJsDate();
            d.setFullYear(d.getFullYear() + years);
            return new DateTime(d, this._kind);
        }
    }, {
        key: 'add',
        value: function add(time) {
            return this.addMilliseconds(time.getTotalMilliseconds());
        }
    }, {
        key: 'subtract',
        value: function subtract(time) {
            return this.addMilliseconds(-time.getTotalMilliseconds());
        }
    }, {
        key: 'timePassedSince',
        value: function timePassedSince(previous) {
            return DateTime.between(previous, this);
        }
    }, {
        key: 'toTimeStamp',
        value: function toTimeStamp() {
            return _TimeStamp2['default'].from(this);
        }
    }, {
        key: 'kind',
        get: function get() {
            return this._kind;
        }
    }, {
        key: 'year',
        get: function get() {
            return this._value.getFullYear();
        }
    }, {
        key: 'month',
        get: function get() {
            return this._value.getMonth();
        }
    }, {
        key: 'day',
        get: function get() {
            return this._value.getDate();
        }
    }, {
        key: 'dayOfWeek',
        get: function get() {
            return this._value.getDay();
        }
    }, {
        key: 'date',
        get: function get() {
            var _ = this;
            return new DateTime(new Date(_.year, _.month, _.day), _._kind);
        }
    }, {
        key: 'timeOfDay',
        get: function get() {
            var _ = this,
                t = _._time;
            if (!t) {
                var d = this._value;
                _._time = t = new _ClockTime2['default'](d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
            }
            return t;
        }
    }, {
        key: 'toUniversalTime',
        get: function get() {
            var _ = this;
            if (_._kind != 1) return new DateTime(_, _._kind);
            var d = _._value;
            return new DateTime(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()), 2);
        }
    }], [{
        key: 'between',
        value: function between(first, last) {
            var f = _Types2['default'].isInstanceOf(first, DateTime) ? first._value : first,
                l = _Types2['default'].isInstanceOf(last, DateTime) ? last._value : last;
            return new _TimeSpan2['default'](f.getTime() - l.getTime());
        }
    }, {
        key: 'isLeapYear',
        value: function isLeapYear(year) {
            return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
        }
    }, {
        key: 'daysInMonth',
        value: function daysInMonth(year, month) {
            return new Date(year, month + 1, 0).getDate();
        }
    }, {
        key: 'now',
        get: function get() {
            return new DateTime();
        }
    }, {
        key: 'today',
        get: function get() {
            return DateTime.now.date;
        }
    }, {
        key: 'tomorrow',
        get: function get() {
            var today = DateTime.today;
            return today.addDays(1);
        }
    }]);

    return DateTime;
})();

Object.freeze(DateTime);
exports['default'] = DateTime;
module.exports = exports['default'];
//# sourceMappingURL=DateTime.js.map
