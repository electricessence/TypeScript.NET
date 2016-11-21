import { IArray } from "./Collections/Array/IArray";
export declare function Integer(n: number): number;
export declare module Integer {
    const MAX_32_BIT: number;
    /**
     * Returns a random integer from minInclusive to the maxExclusive.
     * Negative numbers are allowed.
     *
     * @param maxExclusive
     * @returns {number}
     */
    function random(maxExclusive: number): number;
    module random {
        function next(boundary: number, inclusive?: boolean): number;
        function set(count: number, boundary: number, inclusive?: boolean): number[];
        function nextInRange(min: number, max: number, inclusive?: boolean): number;
        function select<T>(source: IArray<T>): T | undefined;
        module select {
            function one<T>(source: IArray<T>): T | undefined;
        }
    }
    function as32Bit(n: number): number | null;
    function is(n: number): boolean;
    function is32Bit(n: number): boolean;
    function assert(n: number, argumentName?: string): true | never;
    function assertZeroOrGreater(n: number, argumentName?: string): true | never;
    function assertPositive(n: number, argumentName?: string): true | never;
}
export default Integer;
