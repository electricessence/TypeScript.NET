/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Selector} from "../../System/FunctionTypes";
import Primitive from "../../System/Primitive";

export default interface ILinqNotEmpty<T>
{
	aggregate(
		reduction:(previous:T, current:T, index?:number) => T):T;

	reduce(
		reduction:(previous:T, current:T, index?:number) => T):T;

	max():T

	min():T

	maxBy(keySelector?:Selector<T, Primitive>):T

	minBy(keySelector?:Selector<T, Primitive>):T

	any():true;

	isEmpty():false;
}