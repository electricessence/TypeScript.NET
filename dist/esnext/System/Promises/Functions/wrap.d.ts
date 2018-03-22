/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import PromiseBase from "../PromiseBase";
/**
 * Takes any Promise-Like object and ensures an extended version of it from this module.
 * @param target The Promise-Like object
 * @returns A new target that simply extends the target.
 */
export default function wrap<T>(target: T | PromiseLike<T>): PromiseBase<T>;
