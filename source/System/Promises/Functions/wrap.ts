/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import isPromise from "./isPromise";
import PromiseBase from "../PromiseBase";
import PromiseWrapper from "../PromiseWrapper";
import {Fulfilled} from "../Promise";
import ArgumentNullException from "../../Exceptions/ArgumentNullException";

/**
 * Takes any Promise-Like object and ensures an extended version of it from this module.
 * @param target The Promise-Like object
 * @returns A new target that simply extends the target.
 */
export default function wrap<T>(target:T | PromiseLike<T>):PromiseBase<T>
{
	if(!target) throw new ArgumentNullException("target");
	return isPromise(target)
		? (target instanceof PromiseBase ? target : new PromiseWrapper(target))
		: new Fulfilled<T>(target);
}