/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import Primitive from "../Primitive";
import IMap from "../IMap";
/**
 * This takes a string and replaces '{string}' with the respected parameter.
 * Also allows for passing an array in order to use '{n}' notation.
 * Not limited to an array's indexes.  For example, {length} is allowed.
 * Based upon Crockford's supplant function.
 * @param source
 * @param params
 * @returns {string}
 */
export declare function supplant(source: string, params: IMap<Primitive> | ArrayLike<Primitive>): string;
/**
 * Takes any set of arguments and replaces based on index.
 * @param source
 * @param args
 * @returns {string}
 */
export declare function format(source: string, ...args: Primitive[]): string;
