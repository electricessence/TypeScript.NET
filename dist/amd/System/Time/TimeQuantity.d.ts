/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TimeUnit } from "./TimeUnit";
import { IEquatable } from "../IEquatable";
import { IComparable } from "../IComparable";
import { ITimeQuantity } from "./ITimeQuantity";
import { ITimeMeasurement } from "./ITimeMeasurement";
import { Lazy } from "../Lazy";
/**
 * This class provides a simple means for storing and calculating time quantities.
 */
export declare class TimeQuantity implements IEquatable<ITimeQuantity>, IComparable<ITimeQuantity>, ITimeQuantity {
    protected _quantity: number;
    constructor(_quantity?: number);
    getTotalMilliseconds(): number;
    /**
     * +1, 0, or -1 depending on the time direction.
     * @returns {number}
     */
    readonly direction: number;
    /**
     * Compares this instance against any other time quantity instance and return true if the amount of time is the same.
     * @param other
     * @returns {boolean}
     */
    equals(other: ITimeQuantity): boolean;
    /**
     * Compares this instance against any other time quantity instance.
     * @param other
     * @returns {number}
     */
    compareTo(other: ITimeQuantity): number;
    protected _total: Lazy<ITimeMeasurement>;
    protected _resetTotal(): void;
    /**
     * Returns an object with all units exposed as totals.
     * @returns {ITimeMeasurement}
     */
    readonly total: ITimeMeasurement;
    /**
     * Returns the total amount of time measured in the requested TimeUnit.
     * @param units
     * @returns {number}
     */
    getTotal(units: TimeUnit): number;
}
export default TimeQuantity;
