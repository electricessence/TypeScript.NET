/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ITimeQuantity } from "./ITimeQuantity";
export declare enum TimeUnit {
    Ticks = 0,
    Milliseconds = 1,
    Seconds = 2,
    Minutes = 3,
    Hours = 4,
    Days = 5
}
export declare module TimeUnit {
    function toMilliseconds(value: number, units?: TimeUnit): number;
    function fromMilliseconds(ms: number, units: TimeUnit): number;
    function from(quantity: ITimeQuantity, unit: TimeUnit): number;
    function assertValid(unit: TimeUnit): true | never;
}
export default TimeUnit;
