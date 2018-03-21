/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import isPromise from "./isPromise";
import PromiseBase from "../PromiseBase";
import wrap from "./wrap";
import {Fulfilled} from "../Promise";

/**
 * Creates a new resolved promise .
 * @returns A resolved promise.
 */
function resolve():PromiseBase<void>

/**
 * Creates a new resolved promise for the provided value.
 * @param value A value or promise.
 * @returns A promise whose internal state matches the provided promise.
 */
function resolve<T>(value:T | PromiseLike<T>):PromiseBase<T>;
function resolve(value?:any):PromiseBase<any>
{

	return isPromise(value) ? wrap(value) : new Fulfilled(value);
}

export default resolve;