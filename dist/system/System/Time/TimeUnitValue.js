/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./TimeUnit", "./TimeQuantity"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var TimeUnit_1, TimeQuantity_1;
    var TimeUnitValue;
    function getUnitQuantityFrom(q, units) {
        return TimeUnit_1.TimeUnit.fromMilliseconds(q.getTotalMilliseconds(), units);
    }
    return {
        setters:[
            function (TimeUnit_1_1) {
                TimeUnit_1 = TimeUnit_1_1;
            },
            function (TimeQuantity_1_1) {
                TimeQuantity_1 = TimeQuantity_1_1;
            }],
        execute: function() {
            TimeUnitValue = (function (_super) {
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
            exports_1("default", TimeUnitValue);
        }
    }
});
//# sourceMappingURL=TimeUnitValue.js.map