/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IIteratorResult} from "./IIterator";

const VOID0:any = void(0);

export class IteratorResult<T> implements IIteratorResult<T>
{
	constructor(
		public value:T,
		public index?:number,
		public done:boolean = false)
	{
		Object.freeze(this);
	}
}

export module IteratorResult {
	export const Done:IteratorResult<any> = new IteratorResult<any>(VOID0, VOID0, true);
	export function GetDone(value?:any):IteratorResult<any> { return Done; }
}

Object.freeze(IteratorResult);

export default IteratorResult;