/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export declare const EMPTY: string;
/**
 * Returns a numerical (integer) hash code of the string.  Can be used for identifying inequality of contents, but two different strings in rare cases will have the same hash code.
 * @param source
 * @returns {number}
 */
export declare function getHashCode(source: string): number;
export declare function repeat(source: string, count: number): string;
export declare function fromChars(ch: number, count: number): string;
export declare function fromChars(chars: number[]): string;
/**
 * Escapes a RegExp sequence.
 * @param source
 * @returns {string}
 */
export declare function escapeRegExp(source: string): string;
/**
 * Can trim any character or set of characters from the ends of a string.
 * Uses a Regex escapement to replace them with empty.
 * @param source
 * @param chars A string or array of characters desired to be trimmed.
 * @param ignoreCase
 * @returns {string}
 */
export declare function trim(source: string, chars?: string | string[], ignoreCase?: boolean): string;
/**
 * Takes any arg
 * @param source
 * @param args
 * @returns {string}
 */
export declare function format(source: string, ...args: any[]): string;
/**
 * This takes a string and replaces '{string}' with the respected parameter.
 * Also allows for passing an array in order to use '{n}' notation.
 * Not limited to an array's indexes.  For example, {length} is allowed.
 * Based upon Crockford's supplant function.
 * @param source
 * @param params
 * @returns {string}
 */
export declare function supplant(source: string, params: {
    [key: string]: any;
} | any[]): string;
/**
 * Returns true if the pattern matches the beginning of the source.
 * @param source
 * @param pattern
 * @returns {boolean}
 */
export declare function startsWith(source: string, pattern: string): boolean;
/**
 * Returns true if the pattern matches the end of the source.
 * @param source
 * @param pattern
 * @returns {boolean}
 */
export declare function endsWith(source: string, pattern: string): boolean;
