/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual, compare } from "../Compare";
import { TimeUnit } from "./TimeUnit";
export class TimeQuantity {
    constructor(_quantity = 0) {
        this._quantity = _quantity;
    }
    getTotalMilliseconds() {
        return this._quantity;
    }
    get direction() {
        return compare(this.getTotalMilliseconds(), 0);
    }
    equals(other) {
        return areEqual(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
    }
    compareTo(other) {
        return compare(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
    }
    get total() {
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
    }
    getTotal(units) {
        return TimeUnit.fromMilliseconds(this.getTotalMilliseconds(), units);
    }
}
export default TimeQuantity;
//# sourceMappingURL=TimeQuantity.js.map