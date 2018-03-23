/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOfValue from "./TypeOfValue";

/**
 * Returns true if the value parameter is a string.
 * @param value
 * @returns {boolean}
 */
export default function isString(value:any):value is string
{
	return typeof value===TypeOfValue.String;
}