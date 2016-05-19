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

var Types_1 = require("../Types");
var TimeUnit_1 = require("./TimeUnit");
var ClockTime_1 = require("./ClockTime");
var TimeQuantity_1 = require("./TimeQuantity");

var TimeSpan = function (_TimeQuantity_1$TimeQ) {
    _inherits(TimeSpan, _TimeQuantity_1$TimeQ);

    function TimeSpan(value) {
        var units = arguments.length <= 1 || arguments[1] === undefined ? TimeUnit_1.TimeUnit.Milliseconds : arguments[1];

        _classCallCheck(this, TimeSpan);

        var ms = TimeUnit_1.TimeUnit.toMilliseconds(value, units);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TimeSpan).call(this, ms));

        var _ = _this;
        _.ticks = ms * 10000;
        _.milliseconds = ms;
        _.seconds = ms / 1000;
        _.minutes = ms / 60000;
        _.hours = ms / 3600000;
        _.days = ms / 86400000;
        return _this;
    }

    _createClass(TimeSpan, [{
        key: "add",
        value: function add(other) {
            if (Types_1.Type.isNumber(other)) throw new Error("Use .addUnit(value:number,units:TimeUnit) to add a numerical value amount.  Default units are milliseconds.\n" + ".add only supports quantifiable time values (ITimeTotal).");
            return new TimeSpan(this.getTotalMilliseconds() + other.total.milliseconds);
        }
    }, {
        key: "addUnit",
        value: function addUnit(value) {
            var units = arguments.length <= 1 || arguments[1] === undefined ? TimeUnit_1.TimeUnit.Milliseconds : arguments[1];

            return new TimeSpan(this.getTotalMilliseconds() + TimeUnit_1.TimeUnit.toMilliseconds(value, units));
        }
    }, {
        key: "total",
        get: function get() {
            return this;
        }
    }, {
        key: "time",
        get: function get() {
            var _ = this,
                t = _._time;
            if (!t) _._time = t = new ClockTime_1.ClockTime(_.getTotalMilliseconds());
            return t;
        }
    }], [{
        key: "from",
        value: function from(value, units) {
            return new TimeSpan(value, units);
        }
    }, {
        key: "fromDays",
        value: function fromDays(value) {
            return new TimeSpan(value, TimeUnit_1.TimeUnit.Days);
        }
    }, {
        key: "fromHours",
        value: function fromHours(value) {
            return new TimeSpan(value, TimeUnit_1.TimeUnit.Hours);
        }
    }, {
        key: "fromMinutes",
        value: function fromMinutes(value) {
            return new TimeSpan(value, TimeUnit_1.TimeUnit.Minutes);
        }
    }, {
        key: "fromSeconds",
        value: function fromSeconds(value) {
            return new TimeSpan(value, TimeUnit_1.TimeUnit.Seconds);
        }
    }, {
        key: "fromMilliseconds",
        value: function fromMilliseconds(value) {
            return new TimeSpan(value, TimeUnit_1.TimeUnit.Milliseconds);
        }
    }, {
        key: "fromTicks",
        value: function fromTicks(value) {
            return new TimeSpan(value, TimeUnit_1.TimeUnit.Ticks);
        }
    }, {
        key: "zero",
        get: function get() {
            return timeSpanZero || (timeSpanZero = new TimeSpan(0));
        }
    }]);

    return TimeSpan;
}(TimeQuantity_1.TimeQuantity);

exports.TimeSpan = TimeSpan;
var timeSpanZero;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TimeSpan;
//# sourceMappingURL=TimeSpan.js.map
