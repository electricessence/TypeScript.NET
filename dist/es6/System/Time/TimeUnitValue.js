/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TimeUnit } from "./TimeUnit";
import { TimeQuantity } from "./TimeQuantity";
// noinspection JSUnusedLocalSymbols
/**
 * TimeUnitValue allows for passing around a reference to a changeable measure of time coerced by its unit type.
 */
export default class TimeUnitValue extends TimeQuantity {
    constructor(value, _units) {
        super(typeof value == 'number'
            ? value
            : getUnitQuantityFrom(value, _units));
        this._units = _units;
        TimeUnit.assertValid(_units);
    }
    get value() {
        return this._quantity;
    }
    set value(v) {
        this._quantity = v;
        this._resetTotal();
    }
    getTotalMilliseconds() {
        return TimeUnit.toMilliseconds(this._quantity, this._units);
    }
    // To avoid confusion, the unit type can only be set once at construction.
    get units() {
        return this._units;
    }
    to(units = this.units) {
        return TimeUnitValue.from(this, units);
    }
    static from(value, units = TimeUnit.Milliseconds) {
        return new TimeUnitValue(value, units);
    }
}
function getUnitQuantityFrom(q, units) {
    return TimeUnit.fromMilliseconds(q.getTotalMilliseconds(), units);
}
//# sourceMappingURL=TimeUnitValue.js.map