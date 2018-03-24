/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Executor} from "../PromiseTypes";
import TSDNPromise from "../Promise";
import PromiseBase from "../PromiseBase";

/**
 * Syntactic shortcut for avoiding 'new'.
 * @param resolver
 * @param forceSynchronous
 * @returns {Promise}
 */
export default function using<T>(
	resolver:Executor<T>,
	forceSynchronous:boolean = false):PromiseBase<T>
{
	return new TSDNPromise<T>(resolver, forceSynchronous);
}
