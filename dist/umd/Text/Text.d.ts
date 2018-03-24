/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export declare const EMPTY: string;
/**
 * Returns true if the pattern matches the beginning of the source.
 * @param source
 * @param pattern
 * @param ignoreCase
 * @returns {boolean}
 */
export declare function startsWith(source: string | number, pattern: string | number, ignoreCase?: boolean): boolean;
/**
 * Returns true if the pattern matches the end of the source.
 * @param source
 * @param pattern
 * @param ignoreCase
 * @returns {boolean}
 */
export declare function endsWith(source: string | number, pattern: string | number, ignoreCase?: boolean): boolean;
/**
 * Returns true if the pattern matches the end of the source.
 * @param source
 * @param pattern
 * @param ignoreCase
 * @returns {boolean}
 */
export declare function contains(source: string | number, pattern: string | number, ignoreCase?: boolean): boolean;
