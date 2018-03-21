/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {ArgumentNullException} from "../../Exceptions/ArgumentNullException";
import {PromiseCollection} from "../PromiseCollection";

/**
 * Takes a set of promises and returns a PromiseCollection.
 * @param promises
 */
function group<T>(promises:PromiseLike<T>[]):PromiseCollection<T>
function group<T>(
	promise:PromiseLike<T>,
	...rest:PromiseLike<T>[]):PromiseCollection<T>
function group(
	first:PromiseLike<any> | PromiseLike<any>[],
	...rest:PromiseLike<any>[]):PromiseCollection<any>
{

	if(!first && !rest.length) throw new ArgumentNullException("promises");
	return new PromiseCollection(
		((first) instanceof (Array) ? first : [first])
			.concat(rest)
	);
}

export default group;