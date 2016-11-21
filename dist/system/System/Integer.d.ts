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
    /**
     * Converts any number to its 32bit counterpart.
     * Returns null if conversion is not possible.
     * @param n
     * @returns {number}
     */
    function as32Bit(n: number): number | null;
    /**
     * Returns true if the value is an integer.
     * @param n
     * @returns {boolean}
     */
    function is(n: number): boolean;
    /**
     * Returns true if the value is within a 32 bit range.
     * @param n
     * @returns {boolean}
     */
    function is32Bit(n: number): boolean;
    /**
     * Throws if not an integer.
     * @param n
     * @param argumentName
     * @returns {boolean}
     */
    function assert(n: number, argumentName?: string): true | never;
    /**
     * Throws if less than zero.
     * @param n
     * @param argumentName
     * @returns {boolean}
     */
    function assertZeroOrGreater(n: number, argumentName?: string): true | never;
    /**
     * Throws if not greater than zero.
     * @param n
     * @param argumentName
     * @returns {boolean}
     */
    function assertPositive(n: number, argumentName?: string): true | never;
}
export default Integer;
