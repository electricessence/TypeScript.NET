/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports", './TimeUnit', './TimeSpan', '../System'], function (require, exports, TimeUnit, TimeSpan, System) {
    var TimeUnitValue = (function () {
        function TimeUnitValue(value, _type) {
            this.value = value;
            this._type = _type;
            assertValidUnit(_type);
        }
        TimeUnitValue.prototype.coerce = function (other) {
            var type = this._type;
            assertValidUnit(type);
            if (other instanceof TimeSpan) {
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
            return System.areEqual(this.value, o.value);
        };
        TimeUnitValue.prototype.compareTo = function (other) {
            if (other == null)
                return 1 | 0;
            assertComparisonType(other);
            return System.compare(this.value, this.coerce(other).value);
        };
        Object.defineProperty(TimeUnitValue.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        TimeUnitValue.prototype.toTimeSpan = function () {
            return new TimeSpan(this.value, this.type);
        };
        TimeUnitValue.prototype.to = function (units) {
            if (units === void 0) { units = this.type; }
            return this.toTimeSpan().toTimeUnitValue(units);
        };
        return TimeUnitValue;
    })();
    function assertComparisonType(other) {
        if (!(other instanceof TimeUnitValue || other instanceof TimeSpan))
            throw new Error("Invalid comparison type.  Must be of type TimeUnitValue or TimeSpan.");
    }
    function assertValidUnit(unit) {
        if (isNaN(unit) || unit > TimeUnit.Days || unit < TimeUnit.Ticks || Math.floor(unit) !== unit)
            throw new Error("Invalid TimeUnit.");
        return true;
    }
    return TimeUnitValue;
});
//# sourceMappingURL=TimeUnitValue.js.map