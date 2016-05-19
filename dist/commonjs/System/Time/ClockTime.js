/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimeQuantity_1 = require("./TimeQuantity");

var ClockTime = function (_TimeQuantity_1$TimeQ) {
    _inherits(ClockTime, _TimeQuantity_1$TimeQ);

    function ClockTime() {
        _classCallCheck(this, ClockTime);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ClockTime).call(this, arguments.length > 1 ? ClockTime.millisecondsFromTime((arguments.length <= 0 ? undefined : arguments[0]) || 0, (arguments.length <= 1 ? undefined : arguments[1]) || 0, arguments.length > 2 && (arguments.length <= 2 ? undefined : arguments[2]) || 0, arguments.length > 3 && (arguments.length <= 3 ? undefined : arguments[3]) || 0) : arguments.length > 0 && (arguments.length <= 0 ? undefined : arguments[0]) || 0));

        var _ = _this;
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
        return _this;
    }

    _createClass(ClockTime, [{
        key: "toString",
        value: function toString() {
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
}(TimeQuantity_1.TimeQuantity);

exports.ClockTime = ClockTime;
function pluralize(value, label) {
    if (Math.abs(value) !== 1) label += "s";
    return label;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClockTime;
//# sourceMappingURL=ClockTime.js.map
