/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

/**
 * Guarantees a number value or NaN instead.
 * @param value
 * @returns {number}
 */
export function numberOrNaN(value:any):number
{
	return isNaN(value) ? NaN : value;
}