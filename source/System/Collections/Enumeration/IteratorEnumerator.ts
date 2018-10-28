/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import IIterator from "./IIterator";
import SimpleEnumeratorBase from "./SimpleEnumeratorBase";
import __extendsImport from "../../../extends";
import {EndlessIEnumerator, FiniteIEnumerator} from "./IEnumerator";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

/**
 * A simplified stripped down enumerator that until disposed will infinitely return the provided factory.
 * This is analogous to a 'generator' and has a compatible interface.
 *
 *
 */
export class IteratorEnumerator<T>
	extends SimpleEnumeratorBase<T>
{
	/**
	 * @param _iterator
	 * @param _isEndless true and false are explicit where as undefined means 'unknown'.
	 */
	constructor(
		private readonly _iterator:IIterator<T>,
		private readonly _isEndless?:boolean)
	{
		super();
	}

	protected _canMoveNext():boolean
	{
		return this._iterator!=null;
	}

	moveNext(value?:any):boolean
	{
		const _ = this;
		const i = _._iterator;
		if(i)
		{
			const r = arguments.length ? i.next(value) : i.next();
			_._current = r.value;
			if(r.done) _.dispose();
			else return true;
		}
		return false;
	}

	dispose():void
	{
		super.dispose();
		(<any>this)._iterator = null;
	}

	protected getIsEndless():boolean
	{
		return Boolean(this._isEndless) && super.getIsEndless();
	}

	static finite<T>(iterator:IIterator<T>):FiniteIteratorEnumerator<T>
	{
		return new FiniteIteratorEnumerator<T>(iterator);
	}

	static endless<T>(iterator:IIterator<T>):EndlessIteratorEnumerator<T>
	{
		return new EndlessIteratorEnumerator<T>(iterator);
	}
}

export class FiniteIteratorEnumerator<T>
	extends IteratorEnumerator<T>
	implements FiniteIEnumerator<T>
{
	/**
	 * @param iterator
	 */
	constructor(
		iterator:IIterator<T>)
	{
		super(iterator);
	}

	get isEndless():false { return false; }
}

export class EndlessIteratorEnumerator<T>
	extends IteratorEnumerator<T>
	implements EndlessIEnumerator<T>
{
	/**
	 * @param iterator
	 */
	constructor(
		iterator:IIterator<T>)
	{
		super(iterator);
	}

	get isEndless():true { return true; }
}

export default IteratorEnumerator;