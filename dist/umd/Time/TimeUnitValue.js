/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./TimeQuantity", "./TimeUnit"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var TimeQuantity_1 = require("./TimeQuantity");
    var TimeUnit_1 = require("./TimeUnit");
    /**
     * TimeUnitValue allows for passing around a reference to a changeable measure of time coerced by its unit type.
     */
    var TimeUnitValue = /** @class */ (function (_super) {
        tslib_1.__extends(TimeUnitValue, _super);
        function TimeUnitValue(value, _units) {
            var _this = _super.call(this, typeof value == 'number'
                ? value
                : getUnitQuantityFrom(value, _units)) || this;
            _this._units = _units;
            TimeUnit_1.default.assertValid(_units);
            return _this;
        }
        Object.defineProperty(TimeUnitValue.prototype, "value", {
            get: function () {
                return this._quantity;
            },
            set: function (v) {
                this._quantity = v;
                this._resetTotal();
            },
            enumerable: true,
            configurable: true
        });
        TimeUnitValue.prototype.getTotalMilliseconds = function () {
            return TimeUnit_1.default.toMilliseconds(this._quantity, this._units);
        };
        Object.defineProperty(TimeUnitValue.prototype, "units", {
            // To avoid confusion, the unit type can only be set once at construction.
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
            if (units === void 0) { units = TimeUnit_1.default.Milliseconds; }
            return new TimeUnitValue(value, units);
        };
        return TimeUnitValue;
    }(TimeQuantity_1.default));
    exports.default = TimeUnitValue;
    function getUnitQuantityFrom(q, units) {
        return TimeUnit_1.default.fromMilliseconds(q.getTotalMilliseconds(), units);
    }
});
//# sourceMappingURL=TimeUnitValue.js.map