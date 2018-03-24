/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOf from "./TypeOf";

/**
 * Returns true if the value parameter is a function.
 * @param value
 * @returns {boolean}
 */
export default function isFunction(value:any):value is Function
{
	return typeof value===TypeOf.Function;
}