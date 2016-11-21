"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var Compare_1 = require("../Compare");
var TimeUnit_1 = require("./TimeUnit");
/**
 * This class provides a simple means for storing and calculating time quantities.
 */
var TimeQuantity = (function () {
    function TimeQuantity(_quantity) {
        if (_quantity === void 0) { _quantity = 0; }
        this._quantity = _quantity;
    }
    // Provides an overridable mechanism for extending this class.
    TimeQuantity.prototype.getTotalMilliseconds = function () {
        return this._quantity;
    };
    Object.defineProperty(TimeQuantity.prototype, "direction", {
        /**
         * +1, 0, or -1 depending on the time direction.
         * @returns {number}
         */
        get: function () {
            return Compare_1.compare(this.getTotalMilliseconds(), 0);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Compares this instance against any other time quantity instance and return true if the amount of time is the same.
     * @param other
     * @returns {boolean}
     */
    TimeQuantity.prototype.equals = function (other) {
        return Compare_1.areEqual(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
    };
    /**
     * Compares this instance against any other time quantity instance.
     * @param other
     * @returns {CompareResult}
     */
    TimeQuantity.prototype.compareTo = function (other) {
        return Compare_1.compare(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
    };
    Object.defineProperty(TimeQuantity.prototype, "total", {
        /**
         * Returns an object with all units exposed as totals.
         * @returns {ITimeMeasurement}
         */
        get: function () {
            var t = this._total;
            if (!t) {
                var ms = this.getTotalMilliseconds();
                this._total = t = Object.freeze({
                    ticks: ms * 10000 /* Millisecond */,
                    milliseconds: ms,
                    seconds: ms / 1000 /* Second */,
                    minutes: ms / 60000 /* Minute */,
                    hours: ms / 3600000 /* Hour */,
                    days: ms / 86400000 /* Day */,
                });
            }
            return t;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the total amount of time measured in the requested TimeUnit.
     * @param units
     * @returns {number}
     */
    TimeQuantity.prototype.getTotal = function (units) {
        return TimeUnit_1.TimeUnit.fromMilliseconds(this.getTotalMilliseconds(), units);
    };
    return TimeQuantity;
}());
exports.TimeQuantity = TimeQuantity;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TimeQuantity;
//# sourceMappingURL=TimeQuantity.js.map