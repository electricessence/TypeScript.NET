/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import PromiseBase from "../PromiseBase";
/**
 * Creates a new rejected promise for the provided reason.
 * @param reason The reason the promise was rejected.
 * @returns A new rejected Promise.
 */
export declare function reject<T>(reason: T): PromiseBase<T>;
