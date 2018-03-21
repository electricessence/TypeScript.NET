/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import PromiseBase from "../PromiseBase";
import {Rejected} from "../Promise";

/**
 * Creates a new rejected promise for the provided reason.
 * @param reason The reason the promise was rejected.
 * @returns A new rejected Promise.
 */
export function reject<T>(reason:T):PromiseBase<T>
{
	return new Rejected<T>(reason);
}