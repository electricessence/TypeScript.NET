/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TimeUnit } from "./TimeUnit";
import { TimeQuantity } from "./TimeQuantity";
import __extendsImport from "../../extends";
const __extends = __extendsImport;
export default class TimeUnitValue extends TimeQuantity {
    constructor(value, _units) {
        super(typeof (value) == 'number'
            ? value
            : getUnitQuantityFrom(value, _units));
        this._units = _units;
        TimeUnit.assertValid(_units);
    }
    get value() {
        return this._quantity;
    }
    set value(v) {
        this._total = null;
        this._quantity = v;
    }
    getTotalMilliseconds() {
        return TimeUnit.toMilliseconds(this._quantity, this._units);
    }
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