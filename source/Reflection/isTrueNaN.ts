/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOfValue from "./TypeOfValue";

/**
 * Returns true if is a number and is NaN.
 * @param value
 * @returns {boolean}
 */
export default function isTrueNaN(value:any):value is number
{
	return typeof value===TypeOfValue.Number && isNaN(value);
}