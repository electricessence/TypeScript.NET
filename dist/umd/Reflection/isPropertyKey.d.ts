/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import TypeOf from "./TypeOf";
export declare module PropertyKey {
    const typeOfValues: ReadonlyArray<TypeOf>;
}
/**
 * Returns true if the value is a string, number, or symbol.
 * (Can be used for indexing.)
 * @param value
 * @returns {boolean}
 */
export default function isPropertyKey(value: any): value is string | number | symbol;
