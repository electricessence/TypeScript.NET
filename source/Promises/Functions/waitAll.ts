/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import Set from "../../Collections/Set";
import ArrayPromise from "../ArrayPromise";
import ArgumentNullException from "../../Exceptions/ArgumentNullException";

/**
 * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
 * Unlike .all this method waits for all rejections as well as fulfillment.
 */
export default function waitAll<T>(promises:PromiseLike<T>[]):ArrayPromise<PromiseLike<T>>
export default function waitAll<T>(
	promise:PromiseLike<T>,
	...rest:PromiseLike<T>[]):ArrayPromise<PromiseLike<T>>
export default function waitAll(
	first:PromiseLike<any> | PromiseLike<any>[],
	...rest:PromiseLike<any>[]):ArrayPromise<PromiseLike<any>>
{
	if(!first && !rest.length) throw new ArgumentNullException("promises");
	const promises = ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copyArray!
	if(!promises.length || promises.every(v => !v)) return new ArrayPromise<any>(
		r => r(promises), true); // it's a new empty, reuse it. :|


	// Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
	return new ArrayPromise<any>((resolve, reject) => {
		let len = promises.length;

		// Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
		let remaining = new Set(promises.map((v, i) => i)); // get all the indexes...

		let cleanup = () => {
			reject = <any>null;
			resolve = <any>null;
			remaining.dispose();
			remaining = <any>null;
		};

		let checkIfShouldResolve = () => {
			let r = resolve;
			if(r && !remaining.count)
			{
				cleanup();
				r(promises);
			}
		};

		let onResolved = (i:number) => {
			if(remaining)
			{
				remaining.remove(i);
				checkIfShouldResolve();
			}
		};

		for(let i = 0; remaining && i<len; i++)
		{
			let p = promises[i];
			if(p) p.then(v => onResolved(i), e => onResolved(i));
			else onResolved(i);
		}
	});

}
