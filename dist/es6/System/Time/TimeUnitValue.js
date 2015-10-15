/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual, compare } from '../Compare';
import TimeUnit from './TimeUnit';
import TimeSpan from './TimeSpan';
export default class TimeUnitValue {
    constructor(value, _type) {
        this.value = value;
        this._type = _type;
        assertValidUnit(_type);
    }
    coerce(other) {
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
    }
    equals(other) {
        var o = this.coerce(other);
        if (o == null)
            return false;
        return areEqual(this.value, o.value);
    }
    compareTo(other) {
        if (other == null)
            return 1 | 0;
        assertComparisonType(other);
        return compare(this.value, this.coerce(other).value);
    }
    get type() {
        return this._type;
    }
    toTimeSpan() {
        return new TimeSpan(this.value, this.type);
    }
    get total() {
        return this.toTimeSpan();
    }
    to(units = this.type) {
        return this.toTimeSpan().toTimeUnitValue(units);
    }
}
function assertComparisonType(other) {
    if (!(other instanceof TimeUnitValue || other instanceof TimeSpan))
        throw new Error("Invalid comparison type.  Must be of type TimeUnitValue or TimeSpan.");
}
function assertValidUnit(unit) {
    if (isNaN(unit) || unit > TimeUnit.Days || unit < TimeUnit.Ticks || Math.floor(unit) !== unit)
        throw new Error("Invalid TimeUnit.");
    return true;
}
//# sourceMappingURL=TimeUnitValue.js.map