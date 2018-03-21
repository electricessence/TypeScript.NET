/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {ArgumentNullException} from "../../Exceptions/ArgumentNullException";
import {Set} from "../../Collections/Set";
import {ArrayPromise} from "../ArrayPromise";

/**
 * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
 */
function all<T>(promises:PromiseLike<T>[]):ArrayPromise<T>
function all<T>(promise:PromiseLike<T>, ...rest:PromiseLike<T>[]):ArrayPromise<T>
function all(
	first:PromiseLike<any> | PromiseLike<any>[],
	...rest:PromiseLike<any>[]):ArrayPromise<any>
{
	if(!first && !rest.length) throw new ArgumentNullException("promises");
	let promises = ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy!
	if(!promises.length || promises.every(v => !v)) return new ArrayPromise<any>(
		r => r(promises), true); // it's a new empty, reuse it. :|

	// Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
	return new ArrayPromise<any>((resolve, reject) => {
		let result:any[] = [];
		let len = promises.length;
		result.length = len;
		// Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
		let remaining = new Set(promises.map((v, i) => i)); // get all the indexes...

		let cleanup = () => {
			reject = <any>null;
			resolve = <any>null;
			promises.length = 0;
			promises = <any>null;
			remaining.dispose();
			remaining = <any>null;
		};

		let checkIfShouldResolve = () => {
			let r = resolve;
			if(r && !remaining.count)
			{
				cleanup();
				r(result);
			}
		};

		let onFulfill = (v:any, i:number) => {
			if(resolve)
			{
				result[i] = v;
				remaining.remove(i);
				checkIfShouldResolve();
			}
		};

		let onReject = (e?:any) => {
			let r = reject;
			if(r)
			{
				cleanup();
				r(e);
			}
		};

		for(let i = 0; remaining && i<len; i++)
		{
			let p = promises[i];
			if(p) p.then(v => onFulfill(v, i), onReject);
			else remaining.remove(i);
			checkIfShouldResolve();
		}
	});
}

export default all;