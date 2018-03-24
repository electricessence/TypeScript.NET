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
export default function race<T>(promises: PromiseLike<T>[]): PromiseBase<T>;
export default function race<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): PromiseBase<T>;
