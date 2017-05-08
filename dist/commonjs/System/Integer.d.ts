/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export declare function Integer(n: number): number;
export declare module Integer {
    const MAX_32_BIT: number;
    const MAX_VALUE: number;
    /**
     * Converts any number to its 32bit counterpart.
     * Throws if conversion is not possible.
     * @param n
     * @returns {number}
     */
    function as32Bit(n: number): number;
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
