/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Compare", "./TimeUnit"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Compare_1 = require("../Compare");
    var TimeUnit_1 = require("./TimeUnit");
    var TimeQuantity = (function () {
        function TimeQuantity(_quantity) {
            if (_quantity === void 0) { _quantity = 0; }
            this._quantity = _quantity;
        }
        TimeQuantity.prototype.getTotalMilliseconds = function () {
            return this._quantity;
        };
        Object.defineProperty(TimeQuantity.prototype, "direction", {
            get: function () {
                return Compare_1.compare(this.getTotalMilliseconds(), 0);
            },
            enumerable: true,
            configurable: true
        });
        TimeQuantity.prototype.equals = function (other) {
            return Compare_1.areEqual(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
        };
        TimeQuantity.prototype.compareTo = function (other) {
            return Compare_1.compare(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
        };
        Object.defineProperty(TimeQuantity.prototype, "total", {
            get: function () {
                var t = this._total;
                if (!t) {
                    var ms = this.getTotalMilliseconds();
                    this._total = t = Object.freeze({
                        ticks: ms * 10000,
                        milliseconds: ms,
                        seconds: ms / 1000,
                        minutes: ms / 60000,
                        hours: ms / 3600000,
                        days: ms / 86400000,
                    });
                }
                return t;
            },
            enumerable: true,
            configurable: true
        });
        TimeQuantity.prototype.getTotal = function (units) {
            return TimeUnit_1.TimeUnit.fromMilliseconds(this.getTotalMilliseconds(), units);
        };
        return TimeQuantity;
    }());
    exports.TimeQuantity = TimeQuantity;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TimeQuantity;
});
//# sourceMappingURL=TimeQuantity.js.map