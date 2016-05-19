/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TimeUnit } from "./TimeUnit";
import { TimeQuantity } from "./TimeQuantity";
import { ITimeQuantity } from "./ITimeQuantity";
export default class TimeUnitValue extends TimeQuantity {
    private _units;
    constructor(value: number | ITimeQuantity, _units: TimeUnit);
    value: number;
    getTotalMilliseconds(): number;
    units: TimeUnit;
    to(units?: TimeUnit): TimeUnitValue;
    static from(value: number | ITimeQuantity, units?: TimeUnit): TimeUnitValue;
}
