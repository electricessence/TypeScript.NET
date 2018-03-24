/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import ArrayPromise from "../ArrayPromise";
/**
 * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
 * Unlike .all this method waits for all rejections as well as fulfillment.
 */
export default function waitAll<T>(promises: PromiseLike<T>[]): ArrayPromise<PromiseLike<T>>;
export default function waitAll<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): ArrayPromise<PromiseLike<T>>;
