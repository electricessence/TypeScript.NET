/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOf from "./TypeOf";

/**
 * Returns true if is a number and is NaN.
 * @param value
 * @returns {boolean}
 */
export default function isTrueNaN(value:any):value is number
{
	return typeof value===TypeOf.NUMBER && isNaN(value);
}