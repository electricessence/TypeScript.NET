/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import PromiseBase from "../PromiseBase";
import wrap from "./wrap";
import TSDNPromise from "../Promise";
import ArgumentException from "../../Exceptions/ArgumentException";

/**
 * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
 * or rejected.
 * @param promises An array of Promises.
 * @returns A new Promise.
 */
function race<T>(promises:PromiseLike<T>[]):PromiseBase<T>
function race<T>(promise:PromiseLike<T>, ...rest:PromiseLike<T>[]):PromiseBase<T>
function race(
	first:PromiseLike<any> | PromiseLike<any>[],
	...rest:PromiseLike<any>[]):PromiseBase<any>
{
	let promises = first && ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copyArray?
	if(!promises || !promises.length || !(promises = promises.filter(v => v!=null)).length)
		throw new ArgumentException("Nothing to wait for.");

	const len = promises.length;

	// Only one?  Nothing to race.
	if(len==1) return wrap(promises[0]);

	// Look for already resolved promises and the first one wins.
	for(let i = 0; i<len; i++)
	{
		const p:any = promises[i];
		if(p instanceof PromiseBase && p.isSettled) return p;
	}

	return new TSDNPromise((resolve, reject) => {
		let cleanup = () => {
			reject = <any>null;
			resolve = <any>null;
			promises.length = 0;
			promises = <any>null;
		};

		let onResolve = (r:(x:any) => void, v:any) => {
			if(r)
			{
				cleanup();
				r(v);
			}
		};

		let onFulfill = (v:any) => onResolve(resolve, v);
		let onReject = (e?:any) => onResolve(reject, e);

		for(let p of promises)
		{
			if(!resolve) break;
			p.then(onFulfill, onReject);
		}
	});
}

export default race;