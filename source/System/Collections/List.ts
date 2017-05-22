/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {areEqual} from "../Compare";
import {contains, copyTo, indexOf, remove, removeIndex} from "./Array/Utility";
import {forEach} from "./Enumeration/Enumerator";
import {Type} from "../Types";
import {CollectionBase} from "./CollectionBase";
import {ActionWithIndex, EqualityComparison, PredicateWithIndex} from "../FunctionTypes";
import {IEnumerator} from "./Enumeration/IEnumerator";
import {IList} from "./IList";
import {IEnumerateEach} from "./Enumeration/IEnumerateEach";
import {IEnumerableOrArray} from "./IEnumerableOrArray";
import {ArrayLikeWritable} from "./Array/ArrayLikeWritable";
import __extendsImport from "../../extends";
import {EnumeratorBase} from "./Enumeration/EnumeratorBase";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

const VOID0:undefined = void 0;
export class List<T>
	extends CollectionBase<T>
	implements IList<T>, IEnumerateEach<T>
{

	protected readonly _source:T[];

	constructor(
		source?:IEnumerableOrArray<T>,
		equalityComparer:EqualityComparison<T> = areEqual)
	{
		super(VOID0, equalityComparer);
		if((source) instanceof (Array))
		{
			this._source = source.slice();
		}
		else
		{
			this._source = [];
			this._importEntries(source);
		}
	}

	protected _onDispose()
	{
		super._onDispose();
		(<any>this)._source = null;
	}

	protected getCount():number
	{
		return this._source.length;
	}

	protected _addInternal(entry:T):boolean
	{
		this._source.push(entry);
		return true;
	}

	protected _removeInternal(entry:T, max:number = Infinity):number
	{
		return remove(
			this._source, entry, max,
			this._equalityComparer);
	}

	protected _clearInternal():number
	{
		const len = this._source.length;
		this._source.length = 0;
		return len;
	}

	protected _importEntries(entries:IEnumerableOrArray<T> | null | undefined):number
	{
		if(Type.isArrayLike(entries))
		{
			let len = entries.length;
			if(!len) return 0;
			const s = this._source;

			const first = s.length;
			s.length += len;
			for(let i = 0; i<len; i++)
			{
				s[i + first] = entries[i];
			}

			return len;
		}
		else
		{
			return super._importEntries(entries);
		}
	}

	get(index:number):T
	{
		return this._source[index];
	}

	set(index:number, value:T):boolean
	{
		const s = this._source;
		if(index<s.length && areEqual(value, s[index]))
			return false;

		s[index] = value;
		this._signalModification(true);
		return true;
	}

	indexOf(item:T):number
	{
		return indexOf(
			this._source, item,
			this._equalityComparer);
	}

	insert(index:number, value:T):void
	{
		const _ = this;
		const s = _._source;
		if(index<s.length)
		{
			_._source.splice(index, 0, value);
		}
		else
		{
			_._source[index] = value;
		}
		_._signalModification(true);
	}

	removeAt(index:number):boolean
	{
		if(removeIndex(this._source, index))
		{
			this._signalModification(true);
			return true;
		}
		return false;
	}

	contains(item:T):boolean
	{
		return contains(
			this._source, item,
			this._equalityComparer);
	}

	copyTo<TTarget extends ArrayLikeWritable<any>>(target:TTarget, index?:number):TTarget
	{
		return copyTo(this._source, target, 0, index);
	}

	getEnumerator():IEnumerator<T>
	{
		const _ = this;
		_.throwIfDisposed();

		let source:T[], index:number, version:number;
		return new EnumeratorBase<T>(
			() =>
			{
				source = _._source;
				version = _._version;
				index = 0;
			},
			(yielder) =>
			{
				if(index) _.throwIfDisposed();
				else if(_.wasDisposed)
				{
					// We never actually started? Then no biggie.
					return yielder.yieldBreak();
				}

				_.assertVersion(version);

				if(index>=source.length) // Just in case the size changes as we enumerate use '>='.
					return yielder.yieldBreak();

				return yielder.yieldReturn(source[index++]);
			}
		);
	}

	/**
	 * Sorts the underlying array.
	 * @param compareFn The name of the function used to determine the order of the elements. If omitted, the elements are sorted in ascending, ASCII character order.
	 */
	sort(compareFn?: (a:T, b:T)=>number): this
	{
		this._source.sort(compareFn);
		return this;
	}

	forEach(action:ActionWithIndex<T>, useCopy?:boolean):number
	forEach(action:PredicateWithIndex<T>, useCopy?:boolean):number
	forEach(action:ActionWithIndex<T> | PredicateWithIndex<T>, useCopy?:boolean):number
	{
		const s = this._source;
		return forEach(useCopy ? s.slice() : this, action);
	}

}

export default List;