/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IndexEnumerator} from "./IndexEnumerator";
import {Type} from "../../Types";

export class ArrayEnumerator<T> extends IndexEnumerator<T>
{
	constructor(arrayFactory:() => ArrayLike<T>, start?:number, step?:number);
	constructor(array:ArrayLike<T>, start?:number, step?:number);
	constructor(arrayOrFactory:any, start:number = 0, step:number = 1)
	{
		super(
			() =>
			{
				const array = Type.isFunction(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
				return {
					source: array,
					pointer: start,
					length: array ? array.length : 0,
					step: step
				};
			}
		);
	}
}

export default ArrayEnumerator;