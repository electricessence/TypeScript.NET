/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import PromiseCollection from "../PromiseCollection";
/**
 * Creates a PromiseCollection containing promises that will resolve on the next tick using the transform function.
 * This utility function does not chain promises together to create the result,
 * it only uses one promise per transform.
 * @param source
 * @param transform
 * @returns {PromiseCollection}
 */
export default function map<T, U>(source: T[], transform: (value: T) => U): PromiseCollection<U>;
