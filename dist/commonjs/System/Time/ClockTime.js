/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _TimeQuantity2 = require('./TimeQuantity');

var _TimeQuantity3 = _interopRequireDefault(_TimeQuantity2);

var ClockTime = (function (_TimeQuantity) {
    _inherits(ClockTime, _TimeQuantity);

    function ClockTime() {
        _classCallCheck(this, ClockTime);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(ClockTime.prototype), "constructor", this).call(this, args.length > 1 ? ClockTime.millisecondsFromTime(args[0] || 0, args[1] || 0, args.length > 2 && args[2] || 0, args.length > 3 && args[3] || 0) : args.length > 0 && args[0] || 0);
        var _ = this;
        var ms = Math.abs(_.getTotalMilliseconds());
        var msi = Math.floor(ms);
        _.tick = (ms - msi) * 10000;
        _.days = msi / 86400000 | 0;
        msi -= _.days * 86400000;
        _.hour = msi / 3600000 | 0;
        msi -= _.hour * 3600000;
        _.minute = msi / 60000 | 0;
        msi -= _.minute * 60000;
        _.second = msi / 1000 | 0;
        msi -= _.second * 1000;
        _.millisecond = msi;
        Object.freeze(_);
    }

    _createClass(ClockTime, [{
        key: "toString",
        value: function toString() {
            /* INSERT CUSTOM FORMATTING CODE HERE */
            var _ = this,
                a = [];
            if (_.days) a.push(pluralize(_.days, "day"));
            if (_.hour) a.push(pluralize(_.hour, "hour"));
            if (_.minute) a.push(pluralize(_.minute, "minute"));
            if (_.second) a.push(pluralize(_.second, "second"));
            if (a.length > 1) a.splice(a.length - 1, 0, "and");
            return a.join(", ").replace(", and, ", " and ");
        }
    }], [{
        key: "from",
        value: function from(hours, minutes) {
            var seconds = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
            var milliseconds = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

            return new ClockTime(hours, minutes, seconds, milliseconds);
        }
    }, {
        key: "millisecondsFromTime",
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
    }]);

    return ClockTime;
})(_TimeQuantity3["default"]);

exports["default"] = ClockTime;

function pluralize(value, label) {
    if (Math.abs(value) !== 1) label += "s";
    return label;
}
module.exports = exports["default"];
//# sourceMappingURL=ClockTime.js.map
