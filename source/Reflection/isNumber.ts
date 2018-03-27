/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOf from "./TypeOf";

/**
 * Returns true if the value parameter is a number.
 * @param value
 * @param ignoreNaN Default is false. When true, NaN is not considered a number and will return false.
 * @returns {boolean}
 */
export default function isNumber(value:any, ignoreNaN:boolean = false):value is number
{
	return typeof value===TypeOf.NUMBER && (!ignoreNaN || !isNaN(value));
}