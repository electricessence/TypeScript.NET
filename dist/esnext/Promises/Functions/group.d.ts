/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import PromiseCollection from "../PromiseCollection";
/**
 * Takes a set of promises and returns a PromiseCollection.
 * @param promises
 */
export default function group<T>(promises: PromiseLike<T>[]): PromiseCollection<T>;
export default function group<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): PromiseCollection<T>;
