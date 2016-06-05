/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./TimeUnit", "./TimeQuantity", "../../extends"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TimeUnit_1 = require("./TimeUnit");
    var TimeQuantity_1 = require("./TimeQuantity");
    var extends_1 = require("../../extends");
    var __extends = extends_1.default;
    var TimeUnitValue = (function (_super) {
        __extends(TimeUnitValue, _super);
        function TimeUnitValue(value, _units) {
            _super.call(this, typeof (value) == 'number'
                ? value
                : getUnitQuantityFrom(value, _units));
            this._units = _units;
            TimeUnit_1.TimeUnit.assertValid(_units);
        }
        Object.defineProperty(TimeUnitValue.prototype, "value", {
            get: function () {
                return this._quantity;
            },
            set: function (v) {
                this._total = null;
                this._quantity = v;
            },
            enumerable: true,
            configurable: true
        });
        TimeUnitValue.prototype.getTotalMilliseconds = function () {
            return TimeUnit_1.TimeUnit.toMilliseconds(this._quantity, this._units);
        };
        Object.defineProperty(TimeUnitValue.prototype, "units", {
            get: function () {
                return this._units;
            },
            enumerable: true,
            configurable: true
        });
        TimeUnitValue.prototype.to = function (units) {
            if (units === void 0) { units = this.units; }
            return TimeUnitValue.from(this, units);
        };
        TimeUnitValue.from = function (value, units) {
            if (units === void 0) { units = TimeUnit_1.TimeUnit.Milliseconds; }
            return new TimeUnitValue(value, units);
        };
        return TimeUnitValue;
    }(TimeQuantity_1.TimeQuantity));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TimeUnitValue;
    function getUnitQuantityFrom(q, units) {
        return TimeUnit_1.TimeUnit.fromMilliseconds(q.getTotalMilliseconds(), units);
    }
});
//# sourceMappingURL=TimeUnitValue.js.map