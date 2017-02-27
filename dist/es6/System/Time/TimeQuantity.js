/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual, compare } from "../Compare";
import { TimeUnit } from "./TimeUnit";
import { Lazy } from "../Lazy";
/**
 * This class provides a simple means for storing and calculating time quantities.
 */
export class TimeQuantity {
    constructor(_quantity = 0) {
        this._quantity = _quantity;
        this._resetTotal();
    }
    // Provides an overridable mechanism for extending this class.
    getTotalMilliseconds() {
        return this._quantity;
    }
    /**
     * +1, 0, or -1 depending on the time direction.
     * @returns {number}
     */
    get direction() {
        return compare(this.getTotalMilliseconds(), 0);
    }
    /**
     * Compares this instance against any other time quantity instance and return true if the amount of time is the same.
     * @param other
     * @returns {boolean}
     */
    equals(other) {
        return areEqual(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
    }
    /**
     * Compares this instance against any other time quantity instance.
     * @param other
     * @returns {CompareResult}
     */
    compareTo(other) {
        return compare(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
    }
    _resetTotal() {
        const t = this._total;
        if (!t || t.isValueCreated) {
            this._total = Lazy.create(() => {
                const ms = this.getTotalMilliseconds();
                return Object.freeze({
                    ticks: ms * 10000 /* Millisecond */,
                    milliseconds: ms,
                    seconds: ms / 1000 /* Second */,
                    minutes: ms / 60000 /* Minute */,
                    hours: ms / 3600000 /* Hour */,
                    days: ms / 86400000 /* Day */,
                });
            });
        }
    }
    /**
     * Returns an object with all units exposed as totals.
     * @returns {ITimeMeasurement}
     */
    get total() {
        return this._total.value;
    }
    /**
     * Returns the total amount of time measured in the requested TimeUnit.
     * @param units
     * @returns {number}
     */
    getTotal(units) {
        return TimeUnit.fromMilliseconds(this.getTotalMilliseconds(), units);
    }
}
export default TimeQuantity;
//# sourceMappingURL=TimeQuantity.js.map