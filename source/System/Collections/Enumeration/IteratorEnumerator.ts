/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {IIterator} from "./IIterator";
import {SimpleEnumerableBase} from "./SimpleEnumerableBase";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;

const VOID0:any = void 0;

/**
 * A simplified stripped down enumerator that until disposed will infinitely return the provided factory.
 * This is analogous to a 'generator' and has a compatible interface.
 *
 *
 */
export class IteratorEnumerator<T> extends SimpleEnumerableBase<T>
{
	/**
	 * @param _iterator
	 * @param _isEndless true and false are explicit where as undefined means 'unknown'.
	 */
	constructor(private _iterator:IIterator<T>, private _isEndless?:boolean)
	{
		super();
	}

	protected canMoveNext():boolean
	{
		return this._iterator!=null;
	}

	moveNext(value?:any):boolean
	{
		var _ = this;
		var i = _._iterator;
		if(i)
		{
			var r = arguments.length ? i.next(value) : i.next();
			_._current = r.value;
			if(r.done) _.dispose();
			else return true;
		}
		return false;
	}

	dispose():void
	{
		super.dispose();
		this._iterator = VOID0;
	}

	protected getIsEndless():boolean
	{
		return this._isEndless && super.getIsEndless();
	}
}

export default IteratorEnumerator;