/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import PromiseBase from "../PromiseBase";
/**
 * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
 * or rejected.
 * @param promises An array of Promises.
 * @returns A new Promise.
 */
declare function race<T>(promises: PromiseLike<T>[]): PromiseBase<T>;
declare function race<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): PromiseBase<T>;
export default race;
