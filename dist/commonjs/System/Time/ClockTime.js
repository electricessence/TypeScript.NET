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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Compare = require('../Compare');

var _HowMany = require('./HowMany');

var HowMany = _interopRequireWildcard(_HowMany);

var _TimeSpan = require('./TimeSpan');

var _TimeSpan2 = _interopRequireDefault(_TimeSpan);

var ClockTime = (function () {
    function ClockTime() {
        _classCallCheck(this, ClockTime);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        this._totalMilliseconds = args.length > 1 ? _TimeSpan2['default'].millisecondsFromTime(args[0] || 0, args[1] || 0, args.length > 2 && args[2] || 0, args.length > 3 && args[3] || 0) : args.length > 0 && args[0] || 0;
    }

    _createClass(ClockTime, [{
        key: 'equals',
        value: function equals(other) {
            return (0, _Compare.areEqual)(this._totalMilliseconds, other.totalMilliseconds);
        }
    }, {
        key: 'compareTo',
        value: function compareTo(other) {
            if (other == null) return 1 | 0;
            return (0, _Compare.compare)(this._totalMilliseconds, other.totalMilliseconds);
        }
    }, {
        key: 'toTimeSpan',
        value: function toTimeSpan() {
            return new _TimeSpan2['default'](this._totalMilliseconds);
        }
    }, {
        key: 'toString',
        value: function toString() {
            /* INSERT CUSTOM FORMATTING CODE HERE */
            var _ = this,
                a = [];
            if (_.days) a.push(pluralize(_.days, "day"));
            if (_.hours) a.push(pluralize(_.hours, "hour"));
            if (_.minutes) a.push(pluralize(_.minutes, "minute"));
            if (_.seconds) a.push(pluralize(_.seconds, "second"));
            if (a.length > 1) a.splice(a.length - 1, 0, "and");
            return a.join(", ").replace(", and, ", " and ");
        }
    }, {
        key: 'totalMilliseconds',
        get: function get() {
            return this._totalMilliseconds;
        }
    }, {
        key: 'direction',
        get: function get() {
            return (0, _Compare.compare)(this._totalMilliseconds, 0);
        }
    }, {
        key: 'ticks',
        get: function get() {
            var _ = this,
                r = _._ticks;
            if (r === undefined) {
                var ms = Math.abs(_._totalMilliseconds);
                _._ticks = r = (ms - Math.floor(ms)) * 10000;
            }
            return r;
        }
    }, {
        key: 'milliseconds',
        get: function get() {
            var _ = this,
                r = _._ms;
            if (r === undefined) _._ms = r = this._totalMilliseconds % 3600000 | 0;
            return r;
        }
    }, {
        key: 'seconds',
        get: function get() {
            var _ = this,
                r = _._seconds;
            if (r === undefined) _._seconds = r = this._totalMilliseconds / 3600000 % 60 | 0;
            return r;
        }
    }, {
        key: 'minutes',
        get: function get() {
            var _ = this,
                r = _._minutes;
            if (r === undefined) _._minutes = r = this._totalMilliseconds / 3600000 / 60 % 60 | 0;
            return r;
        }
    }, {
        key: 'hours',
        get: function get() {
            var _ = this,
                r = _._hours;
            if (r === undefined) _._hours = r = this._totalMilliseconds / 3600000 / 60 / 60 % 24 | 0;
            return r;
        }
    }, {
        key: 'days',
        get: function get() {
            var _ = this,
                r = _._days;
            if (r === undefined) _._days = r = this._totalMilliseconds / 3600000 / 60 / 60 / 24 | 0;
            return r;
        }
    }, {
        key: 'total',
        get: function get() {
            return this.toTimeSpan();
        }
    }], [{
        key: 'from',
        value: function from(hours, minutes) {
            var seconds = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
            var milliseconds = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

            return new ClockTime(hours, minutes, seconds, milliseconds);
        }
    }]);

    return ClockTime;
})();

exports['default'] = ClockTime;

function pluralize(value, label) {
    if (Math.abs(value) !== 1) label += "s";
    return label;
}
module.exports = exports['default'];
//# sourceMappingURL=ClockTime.js.map
