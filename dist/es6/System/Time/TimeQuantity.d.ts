/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TimeUnit } from "./TimeUnit";
import { IEquatable } from "../IEquatable";
import { IComparable } from "../IComparable";
import { ITimeQuantity } from "./ITimeQuantity";
import { ITimeMeasurement } from "./ITimeMeasurement";
export declare class TimeQuantity implements IEquatable<ITimeQuantity>, IComparable<ITimeQuantity>, ITimeQuantity {
    protected _quantity: number;
    constructor(_quantity?: number);
    getTotalMilliseconds(): number;
    direction: number;
    equals(other: ITimeQuantity): boolean;
    compareTo(other: ITimeQuantity): number;
    protected _total: ITimeMeasurement;
    total: ITimeMeasurement;
    getTotal(units: TimeUnit): number;
}
export default TimeQuantity;
