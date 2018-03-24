/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import SumResult from "./SumResult";
import IAverageResult from "./IAverageResult";

export default class AverageResult extends SumResult implements IAverageResult
{
	readonly average:number;

	constructor(source:ArrayLike<number>, ignoreNaN:boolean = true)
	{
		super(source,ignoreNaN);
		const count = this.count;
		let average = !count ? NaN : this.sum;
		if(!isNaN(average)) average /= count;
		this.average = average;
	}
}