/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import ISumResult from "./ISumResult";

export default interface IAverageResult extends ISumResult
{
	readonly average:number;
}