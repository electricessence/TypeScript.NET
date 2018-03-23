/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import IIteratorResult from "./IIteratorResult";
import IteratorResult, {CompletedIteratorResult} from "./IteratorResult";
import IEnumerator from "./IEnumerator";
import {Action} from "../../FunctionTypes";

const VOID0:undefined = void 0;

abstract class SimpleEnumerableBase<T> implements IEnumerator<T>
{

	protected _current:T|undefined;
	// @ts-ignore
	protected _index:number;

	constructor()
	{
		this.reset();
	}

	get current():T|undefined
	{
		return this._current;
	}

	protected abstract _canMoveNext():boolean;

	get canMoveNext():boolean {
		return this._canMoveNext();
	}

	abstract moveNext():boolean;

	tryMoveNext(out:Action<T>):boolean {
		if(this.moveNext()) {
			out(<T>this._current);
			return true;
		}
		return false;
	}


	protected incrementIndex():number
	{
		let i = this._index;
		this._index = i = isNaN(i) ? 0 : (i + 1);
		return i;
	}

	nextValue():T|undefined
	{
		this.moveNext();
		return this._current;
	}

	next():IIteratorResult<T>
	{
		return this.moveNext()
			? new IteratorResult(this._current, this._index)
			: CompletedIteratorResult;
	}

	end():void {
		this.dispose();
	}

	'return'():IIteratorResult<void>
	'return'<TReturn>(value:TReturn):IIteratorResult<TReturn>
	'return'(value?:any):IIteratorResult<any>
	{
		try
		{
			return value!==VOID0 && this._canMoveNext()
				? new IteratorResult(value, VOID0, true)
				: CompletedIteratorResult;
		}
		finally
		{
			this.dispose();
		}
	}

	reset():void
	{
		this._current = VOID0;
		this._index = NaN;
	}

	dispose():void
	{
		this.reset();
	}

	protected getIsEndless():boolean
	{
		return this._canMoveNext();
	}

	get isEndless():boolean|undefined
	{
		return this.getIsEndless();
	}
}

export default SimpleEnumerableBase;
