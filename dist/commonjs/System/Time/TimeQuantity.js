/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compare_1 = require("../Compare");
var TimeUnit_1 = require("./TimeUnit");

var TimeQuantity = function () {
    function TimeQuantity() {
        var _quantity = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

        _classCallCheck(this, TimeQuantity);

        this._quantity = _quantity;
    }

    _createClass(TimeQuantity, [{
        key: "getTotalMilliseconds",
        value: function getTotalMilliseconds() {
            return this._quantity;
        }
    }, {
        key: "equals",
        value: function equals(other) {
            return Compare_1.areEqual(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
        }
    }, {
        key: "compareTo",
        value: function compareTo(other) {
            return Compare_1.compare(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
        }
    }, {
        key: "getTotal",
        value: function getTotal(units) {
            return TimeUnit_1.TimeUnit.fromMilliseconds(this.getTotalMilliseconds(), units);
        }
    }, {
        key: "direction",
        get: function get() {
            return Compare_1.compare(this.getTotalMilliseconds(), 0);
        }
    }, {
        key: "total",
        get: function get() {
            var t = this._total;
            if (!t) {
                var ms = this.getTotalMilliseconds();
                this._total = t = Object.freeze({
                    ticks: ms * 10000,
                    milliseconds: ms,
                    seconds: ms / 1000,
                    minutes: ms / 60000,
                    hours: ms / 3600000,
                    days: ms / 86400000
                });
            }
            return t;
        }
    }]);

    return TimeQuantity;
}();

exports.TimeQuantity = TimeQuantity;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TimeQuantity;
//# sourceMappingURL=TimeQuantity.js.map
