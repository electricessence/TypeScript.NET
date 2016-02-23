/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="ITimeMeasurement.d.ts"/>

interface ITimeQuantity {
	getTotalMilliseconds():number;
	total:ITimeMeasurement;
}
