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

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Types = require('../Types');

var _Types2 = _interopRequireDefault(_Types);

var _TimeUnit = require('./TimeUnit');

var _TimeUnit2 = _interopRequireDefault(_TimeUnit);

var _ClockTime = require('./ClockTime');

var _ClockTime2 = _interopRequireDefault(_ClockTime);

var _TimeQuantity2 = require('./TimeQuantity');

var _TimeQuantity3 = _interopRequireDefault(_TimeQuantity2);

var TimeSpan = (function (_TimeQuantity) {
    _inherits(TimeSpan, _TimeQuantity);

    function TimeSpan(value) {
        var units = arguments.length <= 1 || arguments[1] === undefined ? _TimeUnit2['default'].Milliseconds : arguments[1];

        _classCallCheck(this, TimeSpan);

        var ms = _TimeUnit2['default'].toMilliseconds(value, units);
        _get(Object.getPrototypeOf(TimeSpan.prototype), 'constructor', this).call(this, ms);
        var _ = this;
        _.ticks = ms * 10000;
        _.milliseconds = ms;
        _.seconds = ms / 1000;
        _.minutes = ms / 60000;
        _.hours = ms / 3600000;
        _.days = ms / 86400000;
    }

    _createClass(TimeSpan, [{
        key: 'add',
        value: function add(other) {
            if (_Types2['default'].isNumber(other)) throw new Error("Use .addUnit(value:number,units:TimeUnit) to add a numerical value amount.  Default units are milliseconds.\n" + ".add only supports quantifiable time values (ITimeTotal).");
            return new TimeSpan(this.getTotalMilliseconds() + other.total.milliseconds);
        }
    }, {
        key: 'addUnit',
        value: function addUnit(value) {
            var units = arguments.length <= 1 || arguments[1] === undefined ? _TimeUnit2['default'].Milliseconds : arguments[1];

            return new TimeSpan(this.getTotalMilliseconds() + _TimeUnit2['default'].toMilliseconds(value, units));
        }
    }, {
        key: 'total',
        get: function get() {
            return this;
        }
    }, {
        key: 'time',
        get: function get() {
            var _ = this,
                t = _._time;
            if (!t) _._time = t = new _ClockTime2['default'](_.getTotalMilliseconds());
            return t;
        }
    }], [{
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
        key: 'zero',
        get: function get() {
            return timeSpanZero || (timeSpanZero = new TimeSpan(0));
        }
    }]);

    return TimeSpan;
})(_TimeQuantity3['default']);

exports['default'] = TimeSpan;

var timeSpanZero;
module.exports = exports['default'];
//# sourceMappingURL=TimeSpan.js.map
