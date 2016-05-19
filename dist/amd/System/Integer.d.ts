/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IArray } from "./Collections/Array/IArray";
export declare function Integer(n: number): number;
export declare module Integer {
    const MAX_32_BIT: number;
    function random(maxExclusive: number): number;
    module random {
        function next(boundary: number, inclusive?: boolean): number;
        function nextInRange(min: number, max: number, inclusive?: boolean): number;
        function select<T>(source: IArray<T>): T;
        module select {
            function one<T>(source: IArray<T>): T;
        }
    }
    function as32Bit(n: number): number;
    function is(n: number): boolean;
    function is32Bit(n: number): boolean;
    function assert(n: number, argumentName?: string): boolean;
    function assertZeroOrGreater(n: number, argumentName?: string): boolean;
    function assertPositive(n: number, argumentName?: string): boolean;
}
export default Integer;
