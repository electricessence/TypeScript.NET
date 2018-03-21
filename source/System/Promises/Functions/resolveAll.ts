/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {ArgumentNullException} from "../../Exceptions/ArgumentNullException";
import {PromiseCollection} from "../PromiseCollection";
import resolve from "./resolve";

/**
 * Takes a set of values or promises and returns a PromiseCollection.
 * Similar to 'group' but calls resolve on each entry.
 * @param resolutions
 */
function resolveAll<T>(resolutions:Array<T | PromiseLike<T>>):PromiseCollection<T>;
function resolveAll<T>(
	promise:T | PromiseLike<T>,
	...rest:Array<T | PromiseLike<T>>):PromiseCollection<T>
function resolveAll(
	first:any | PromiseLike<any> | Array<any | PromiseLike<any>>,
	...rest:Array<any | PromiseLike<any>>):PromiseCollection<any>
{
	if(!first && !rest.length) throw new ArgumentNullException("resolutions");
	return new PromiseCollection(
		((first) instanceof (Array) ? first : [first])
			.concat(rest)
			.map((v:any) => resolve(v)));
}

export default resolveAll;