/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOfValue from "./TypeOfValue";

/**
 * Returns true if the value parameter is a function.
 * @param value
 * @returns {boolean}
 */
export default function isFunction(value:any):value is Function
{
	return typeof value===TypeOfValue.Function;
}