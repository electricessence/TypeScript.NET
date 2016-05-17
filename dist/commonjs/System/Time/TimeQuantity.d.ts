/// <reference path="../../../../source/System/Time/ITimeQuantity.d.ts" />
/// <reference path="../../../../source/System/IEquatable.d.ts" />
/// <reference path="../../../../source/System/IComparable.d.ts" />
/// <reference path="../../../../gulp-tsc-tmp-116417-8480-6j8rh0/System/Time/HowMany.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import TimeUnit from './TimeUnit';
export default class TimeQuantity implements IEquatable<ITimeQuantity>, IComparable<ITimeQuantity>, ITimeQuantity {
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
