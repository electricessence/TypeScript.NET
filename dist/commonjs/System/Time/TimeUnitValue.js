"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TimeUnit_1 = require("./TimeUnit");
var TimeQuantity_1 = require("./TimeQuantity");
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
/**
 * TimeUnitValue allows for passing around a reference to a changeable measure of time coerced by its unit type.
 */
var TimeUnitValue = /** @class */ (function (_super) {
    __extends(TimeUnitValue, _super);
    function TimeUnitValue(value, _units) {
        var _this = _super.call(this, typeof value == 'number'
            ? value
            : getUnitQuantityFrom(value, _units)) || this;
        _this._units = _units;
        TimeUnit_1.TimeUnit.assertValid(_units);
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
        return TimeUnit_1.TimeUnit.toMilliseconds(this._quantity, this._units);
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
        if (units === void 0) { units = TimeUnit_1.TimeUnit.Milliseconds; }
        return new TimeUnitValue(value, units);
    };
    return TimeUnitValue;
}(TimeQuantity_1.TimeQuantity));
exports.default = TimeUnitValue;
function getUnitQuantityFrom(q, units) {
    return TimeUnit_1.TimeUnit.fromMilliseconds(q.getTotalMilliseconds(), units);
}
//# sourceMappingURL=TimeUnitValue.js.map