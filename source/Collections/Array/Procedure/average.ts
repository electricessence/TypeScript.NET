/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import AverageResult from "./AverageResult";

export function average(source:ArrayLike<number>, ignoreNaN:boolean = false):number
{
	return new AverageResult(source,ignoreNaN).average;
}
