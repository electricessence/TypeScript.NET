/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TimeUnit } from "./TimeUnit";
import { TimeQuantity } from "./TimeQuantity";
import { ITimeQuantity } from "./ITimeQuantity";
/**
 * TimeUnitValue allows for passing around a reference to a changeable measure of time coerced by its unit type.
 */
export default class TimeUnitValue extends TimeQuantity {
    private _units;
    constructor(value: number | ITimeQuantity, _units: TimeUnit);
    value: number;
    getTotalMilliseconds(): number;
    readonly units: TimeUnit;
    to(units?: TimeUnit): TimeUnitValue;
    static from(value: number | ITimeQuantity, units?: TimeUnit): TimeUnitValue;
}
