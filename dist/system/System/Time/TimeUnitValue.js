/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['../Compare', './TimeUnit', './TimeSpan'], function(exports_1) {
    var Compare_1, TimeUnit_1, TimeSpan_1;
    var TimeUnitValue;
    function assertComparisonType(other) {
        if (!(other instanceof TimeUnitValue || other instanceof TimeSpan_1.default))
            throw new Error("Invalid comparison type.  Must be of type TimeUnitValue or TimeSpan.");
    }
    function assertValidUnit(unit) {
        if (isNaN(unit) || unit > TimeUnit_1.default.Days || unit < TimeUnit_1.default.Ticks || Math.floor(unit) !== unit)
            throw new Error("Invalid TimeUnit.");
        return true;
    }
    return {
        setters:[
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            },
            function (TimeUnit_1_1) {
                TimeUnit_1 = TimeUnit_1_1;
            },
            function (TimeSpan_1_1) {
                TimeSpan_1 = TimeSpan_1_1;
            }],
        execute: function() {
            TimeUnitValue = (function () {
                function TimeUnitValue(value, _type) {
                    this.value = value;
                    this._type = _type;
                    assertValidUnit(_type);
                }
                TimeUnitValue.prototype.coerce = function (other) {
                    var type = this._type;
                    assertValidUnit(type);
                    if (other instanceof TimeSpan_1.default) {
                        other = other.toTimeUnitValue(type);
                    }
                    else if (other instanceof TimeUnitValue) {
                        if (type !== other.type)
                            other = other.to(type);
                    }
                    else
                        return null;
                    return other;
                };
                TimeUnitValue.prototype.equals = function (other) {
                    var o = this.coerce(other);
                    if (o == null)
                        return false;
                    return Compare_1.areEqual(this.value, o.value);
                };
                TimeUnitValue.prototype.compareTo = function (other) {
                    if (other == null)
                        return 1 | 0;
                    assertComparisonType(other);
                    return Compare_1.compare(this.value, this.coerce(other).value);
                };
                Object.defineProperty(TimeUnitValue.prototype, "type", {
                    get: function () {
                        return this._type;
                    },
                    enumerable: true,
                    configurable: true
                });
                TimeUnitValue.prototype.toTimeSpan = function () {
                    return new TimeSpan_1.default(this.value, this.type);
                };
                Object.defineProperty(TimeUnitValue.prototype, "total", {
                    get: function () {
                        return this.toTimeSpan();
                    },
                    enumerable: true,
                    configurable: true
                });
                TimeUnitValue.prototype.to = function (units) {
                    if (units === void 0) { units = this.type; }
                    return this.toTimeSpan().toTimeUnitValue(units);
                };
                return TimeUnitValue;
            })();
            exports_1("default", TimeUnitValue);
        }
    }
});
//# sourceMappingURL=TimeUnitValue.js.map