/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {IIteratorResult} from "./IIterator";
import {IteratorResult} from "./IteratorResult";
import {IEnumerator} from "./IEnumerator";

const VOID0:any = void 0;

export abstract class SimpleEnumerableBase<T> implements IEnumerator<T>
{

	protected _current:T;
	protected _index:number;

	constructor()
	{
		this.reset();
	}

	get current():T
	{
		return this._current;
	}

	protected abstract canMoveNext():boolean;
	abstract moveNext():boolean;

	protected incrementIndex():number {
		let i = this._index;
		this._index = i = i===VOID0 ? 0 : (i+1);
		return i;
	}

	nextValue():T
	{
		this.moveNext();
		return this._current;
	}

	next():IIteratorResult<T>
	{
		return this.moveNext()
			? new IteratorResult(this._current,this._index)
			: IteratorResult.Done;
	}

	'return'():IIteratorResult<void>
	'return'<TReturn>(value:TReturn):IIteratorResult<TReturn>
	'return'(value?:any):IIteratorResult<any>
	{
		try
		{
			return value!==VOID0 && this.canMoveNext()
				? new IteratorResult(value,VOID0,true)
				: IteratorResult.Done;
		}
		finally
		{
			this.dispose();
		}
	}

	reset():void
	{
		this._current = VOID0;
		this._index = VOID0;
	}

	dispose():void
	{
		this.reset();
	}

	protected getIsEndless():boolean {
		return this.canMoveNext();
	}

	get isEndless():boolean
	{
		return this.getIsEndless();
	}
}

export default SimpleEnumerableBase;
