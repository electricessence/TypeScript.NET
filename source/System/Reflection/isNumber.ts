/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOfValue from "./TypeOfValue";

/**
 * Returns true if the value parameter is a number.
 * @param value
 * @param ignoreNaN Default is false. When true, NaN is not considered a number and will return false.
 * @returns {boolean}
 */
export default function isNumber(value:any, ignoreNaN:boolean = false):value is number
{
	return typeof value===TypeOfValue.Number && (!ignoreNaN || !isNaN(value));
}