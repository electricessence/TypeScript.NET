/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IIteratorResult} from "./IIterator";

const VOID0:undefined = void 0;

export class IteratorResult<T> implements IIteratorResult<T>
{
	public readonly value:T;
	public readonly index?:number;
	public readonly done:boolean;

	constructor(
		value:T,
		done:boolean)
	constructor(
		value:T,
		index?:number,
		done?:boolean)
	constructor(
		value:T,
		index?:number|boolean,
		done:boolean = false)
	{
		this.value = value;
		if(typeof index=='boolean')
			this.done = index;
		else
		{
			this.index = index;
			this.done = done;
		}
		Object.freeze(this);
	}
}

export module IteratorResult
{
	export const Done:IteratorResult<any> = new IteratorResult<any>(VOID0, VOID0, true);

	export function GetDone():IteratorResult<any> { return Done; }
}

Object.freeze(IteratorResult);

export default IteratorResult;