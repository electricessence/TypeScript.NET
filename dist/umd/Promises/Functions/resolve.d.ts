/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import PromiseBase from "../PromiseBase";
/**
 * Creates a new resolved promise .
 * @returns A resolved promise.
 */
export default function resolve(): PromiseBase<void>;
/**
 * Creates a new resolved promise for the provided value.
 * @param value A value or promise.
 * @returns A promise whose internal state matches the provided promise.
 */
export default function resolve<T>(value: T | PromiseLike<T>): PromiseBase<T>;
