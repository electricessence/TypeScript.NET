/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import ArrayPromise from "../ArrayPromise";
/**
 * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
 */
declare function all<T>(promises: PromiseLike<T>[]): ArrayPromise<T>;
declare function all<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): ArrayPromise<T>;
export default all;
