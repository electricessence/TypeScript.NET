/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
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

var _Compare = require('../Compare');

var _Types = require('../Types');

var _Types2 = _interopRequireDefault(_Types);

var _HowMany = require('./HowMany');

var HowMany = _interopRequireWildcard(_HowMany);

var _TimeUnit = require('./TimeUnit');

var _TimeUnit2 = _interopRequireDefault(_TimeUnit);

var _TimeUnitValue = require('./TimeUnitValue');

var _TimeUnitValue2 = _interopRequireDefault(_TimeUnitValue);

var _ClockTime = require('./ClockTime');

var _ClockTime2 = _interopRequireDefault(_ClockTime);

var TimeSpan = (function () {
    function TimeSpan(value) {
        var units = arguments.length <= 1 || arguments[1] === undefined ? _TimeUnit2['default'].Milliseconds : arguments[1];

        _classCallCheck(this, TimeSpan);

        this._milliseconds = TimeSpan.convertToMilliseconds(value, units);
    }

    _createClass(TimeSpan, [{
        key: 'equals',
        value: function equals(other) {
            var otherMS = getMilliseconds(other);
            if (other === undefined) return false;
            return (0, _Compare.areEqual)(this._milliseconds, otherMS);
        }
    }, {
        key: 'compareTo',
        value: function compareTo(other) {
            if (other == null) return 1 | 0;
            assertComparisonType(other);
            return (0, _Compare.compare)(this._milliseconds, getMilliseconds(other));
        }
    }, {
        key: 'toTimeUnitValue',
        value: function toTimeUnitValue() {
            var units = arguments.length <= 0 || arguments[0] === undefined ? _TimeUnit2['default'].Milliseconds : arguments[0];

            return new _TimeUnitValue2['default'](this.getTotal(units), units);
        }
    }, {
        key: 'getTotal',
        value: function getTotal(units) {
            var _ = this;
            switch (units) {
                case _TimeUnit2['default'].Days:
                    return _.days;
                case _TimeUnit2['default'].Hours:
                    return _.hours;
                case _TimeUnit2['default'].Minutes:
                    return _.minutes;
                case _TimeUnit2['default'].Seconds:
                    return _.seconds;
                case _TimeUnit2['default'].Milliseconds:
                    return _._milliseconds;
                case _TimeUnit2['default'].Ticks:
                    return _._milliseconds * 10000;
                default:
                    throw new Error("Invalid TimeUnit.");
            }
        }
    }, {
        key: 'add',
        value: function add(other) {
            if (_Types2['default'].isNumber(other)) throw new Error("Use .addUnit to add a numerical value amount.  " + ".add only supports ClockTime, TimeSpan, and TimeUnitValue.");
            if (other instanceof _TimeUnitValue2['default'] || other instanceof _ClockTime2['default']) other = other.toTimeSpan();
            return new TimeSpan(this._milliseconds + other.milliseconds);
        }
    }, {
        key: 'addUnit',
        value: function addUnit(value) {
            var units = arguments.length <= 1 || arguments[1] === undefined ? _TimeUnit2['default'].Milliseconds : arguments[1];

            return new TimeSpan(this._milliseconds + TimeSpan.convertToMilliseconds(value, units));
        }
    }, {
        key: 'ticks',
        get: function get() {
            return this._milliseconds * 10000;
        }
    }, {
        key: 'milliseconds',
        get: function get() {
            return this._milliseconds;
        }
    }, {
        key: 'seconds',
        get: function get() {
            return this._milliseconds / 1000;
        }
    }, {
        key: 'minutes',
        get: function get() {
            return this.seconds / 60;
        }
    }, {
        key: 'hours',
        get: function get() {
            return this.minutes / 60;
        }
    }, {
        key: 'days',
        get: function get() {
            return this.hours / 24;
        }
    }, {
        key: 'total',
        get: function get() {
            return this;
        }
    }, {
        key: 'time',
        get: function get() {
            return new _ClockTime2['default'](this._milliseconds);
        }
    }], [{
        key: 'convertToMilliseconds',
        value: function convertToMilliseconds(value) {
            var units = arguments.length <= 1 || arguments[1] === undefined ? _TimeUnit2['default'].Milliseconds : arguments[1];

            switch (units) {
                case _TimeUnit2['default'].Days:
                    value *= 24;
                case _TimeUnit2['default'].Hours:
                    value *= 60;
                case _TimeUnit2['default'].Minutes:
                    value *= 60;
                case _TimeUnit2['default'].Seconds:
                    value *= 1000;
                case _TimeUnit2['default'].Milliseconds:
                    return value;
                case _TimeUnit2['default'].Ticks:
                    return value / 10000;
                default:
                    throw new Error("Invalid TimeUnit.");
            }
        }
    }, {
        key: 'from',
        value: function from(value, units) {
            return new TimeSpan(value, units);
        }
    }, {
        key: 'fromDays',
        value: function fromDays(value) {
            return new TimeSpan(value, _TimeUnit2['default'].Days);
        }
    }, {
        key: 'fromHours',
        value: function fromHours(value) {
            return new TimeSpan(value, _TimeUnit2['default'].Hours);
        }
    }, {
        key: 'fromMinutes',
        value: function fromMinutes(value) {
            return new TimeSpan(value, _TimeUnit2['default'].Minutes);
        }
    }, {
        key: 'fromSeconds',
        value: function fromSeconds(value) {
            return new TimeSpan(value, _TimeUnit2['default'].Seconds);
        }
    }, {
        key: 'fromMilliseconds',
        value: function fromMilliseconds(value) {
            return new TimeSpan(value, _TimeUnit2['default'].Milliseconds);
        }
    }, {
        key: 'fromTicks',
        value: function fromTicks(value) {
            return new TimeSpan(value, _TimeUnit2['default'].Ticks);
        }
    }, {
        key: 'fromTime',
        value: function fromTime(hours, minutes) {
            var seconds = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
            var milliseconds = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

            return new TimeSpan(TimeSpan.millisecondsFromTime(hours, minutes, seconds, milliseconds));
        }
    }, {
        key: 'millisecondsFromTime',
        value: function millisecondsFromTime(hours, minutes) {
            var seconds = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
            var milliseconds = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

            var value = hours;
            value *= 60;
            value += minutes;
            value *= 60;
            value += seconds;
            value *= 1000;
            value += milliseconds;
            return value;
        }
    }, {
        key: 'between',
        value: function between(first, last) {
            return new TimeSpan(last.getTime() - first.getTime());
        }
    }, {
        key: 'zero',
        get: function get() {
            return timeSpanZero || (timeSpanZero = new TimeSpan(0));
        }
    }]);

    return TimeSpan;
})();

exports['default'] = TimeSpan;

function assertComparisonType(other) {
    if (!(other instanceof _TimeUnitValue2['default'] || other instanceof TimeSpan)) throw new Error("Invalid comparison type.  Must be of type TimeUnitValue or TimeSpan.");
}
function getMilliseconds(other) {
    if (other instanceof _TimeUnitValue2['default']) {
        var o = other;
        return o.type === _TimeUnit2['default'].Milliseconds ? o.value : o.toTimeSpan().milliseconds;
    } else if (other instanceof TimeSpan) {
        return other._milliseconds;
    }
    return undefined;
}
var timeSpanZero;
module.exports = exports['default'];
//# sourceMappingURL=TimeSpan.js.map
