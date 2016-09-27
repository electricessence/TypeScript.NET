/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {ITimeMeasurement} from "./ITimeMeasurement";

export interface ITimeQuantity
{
	getTotalMilliseconds():number;
	total:ITimeMeasurement;
}

export default ITimeQuantity;
