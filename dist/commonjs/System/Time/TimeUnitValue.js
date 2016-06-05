/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimeUnit_1 = require("./TimeUnit");
var TimeQuantity_1 = require("./TimeQuantity");
var extends_1 = require("../../extends");
var __extends = extends_1.default;

var TimeUnitValue = function (_TimeQuantity_1$TimeQ) {
    _inherits(TimeUnitValue, _TimeQuantity_1$TimeQ);

    function TimeUnitValue(value, _units) {
        _classCallCheck(this, TimeUnitValue);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TimeUnitValue).call(this, typeof value == 'number' ? value : getUnitQuantityFrom(value, _units)));

        _this._units = _units;
        TimeUnit_1.TimeUnit.assertValid(_units);
        return _this;
    }

    _createClass(TimeUnitValue, [{
        key: "getTotalMilliseconds",
        value: function getTotalMilliseconds() {
            return TimeUnit_1.TimeUnit.toMilliseconds(this._quantity, this._units);
        }
    }, {
        key: "to",
        value: function to() {
            var units = arguments.length <= 0 || arguments[0] === undefined ? this.units : arguments[0];

            return TimeUnitValue.from(this, units);
        }
    }, {
        key: "value",
        get: function get() {
            return this._quantity;
        },
        set: function set(v) {
            this._total = null;
            this._quantity = v;
        }
    }, {
        key: "units",
        get: function get() {
            return this._units;
        }
    }], [{
        key: "from",
        value: function from(value) {
            var units = arguments.length <= 1 || arguments[1] === undefined ? TimeUnit_1.TimeUnit.Milliseconds : arguments[1];

            return new TimeUnitValue(value, units);
        }
    }]);

    return TimeUnitValue;
}(TimeQuantity_1.TimeQuantity);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TimeUnitValue;
function getUnitQuantityFrom(q, units) {
    return TimeUnit_1.TimeUnit.fromMilliseconds(q.getTotalMilliseconds(), units);
}
//# sourceMappingURL=TimeUnitValue.js.map
