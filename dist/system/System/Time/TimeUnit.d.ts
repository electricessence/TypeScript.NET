/// <reference path="../../../../source/System/Time/ITimeQuantity.d.ts" />
/// <reference path="../../../../gulp-tsc-tmp-116418-4632-oby9rl/System/Time/HowMany.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
declare enum TimeUnit {
    Ticks = 0,
    Milliseconds = 1,
    Seconds = 2,
    Minutes = 3,
    Hours = 4,
    Days = 5,
}
declare module TimeUnit {
    function toMilliseconds(value: number, units?: TimeUnit): number;
    function fromMilliseconds(ms: number, units: TimeUnit): number;
    function from(quantity: ITimeQuantity, unit: TimeUnit): number;
    function assertValid(unit: TimeUnit): boolean;
}
export default TimeUnit;
