/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {areEqual} from "../Compare";
import {remove, indexOf, contains, copyTo, removeIndex} from "./Array/Utility";
import {forEach} from "./Enumeration/Enumerator";
import {Type} from "../Types";
import {ArrayEnumerator} from "./Enumeration/ArrayEnumerator";
import {CollectionBase} from "./CollectionBase";
import {Predicate, Action, EqualityComparison} from "../FunctionTypes";
import {IEnumerator} from "./Enumeration/IEnumerator";
import {IList} from "./IList";
import {IEnumerateEach} from "./Enumeration/IEnumerateEach";
import {IEnumerableOrArray} from "./IEnumerableOrArray";
import {IArray} from "./Array/IArray";
import __extendsImport from "../../extends";
const __extends = __extendsImport;

export class List<T>
extends CollectionBase<T> implements IList<T>, IEnumerateEach<T>
{

	protected _source:T[];

	constructor(
		source?:IEnumerableOrArray<T>,
		equalityComparer:EqualityComparison<T> = areEqual)
	{
		super(null, equalityComparer);
		var _ = this;
		if(Array.isArray(source))
		{
			_._source = source.slice();
		}
		else
		{
			_._source = [];
			_._importEntries(source);
		}
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
		var len = this._source.length;
		this._source.length = 0;
		return len;
	}

	protected _importEntries(entries:IEnumerableOrArray<T>):number
	{
		if(Type.isArrayLike(entries))
		{
			var len = entries.length;
			if(!len) return 0;
			var s = this._source;

			var first = s.length;
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
		var s = this._source;
		if(index<s.length && areEqual(value, s[index]))
			return false;

		s[index] = value;
		this._onModified();
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
		var s = this._source;
		if(index<s.length)
		{
			this._source.splice(index, 0, value);
		}
		else
		{
			this._source[index] = value;
		}
		this._onModified();
	}

	removeAt(index:number):boolean
	{
		if(removeIndex(this._source, index))
		{
			this._onModified();
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

	copyTo<TTarget extends IArray<any>>(target:TTarget, index?:number):TTarget
	{
		return copyTo(this._source, target, 0, index);
	}

	getEnumerator():IEnumerator<T>
	{
		return new ArrayEnumerator(this._source);
	}

	forEach(action:Predicate<T>|Action<T>, useCopy?:boolean):number
	{
		var s = this._source;
		return forEach(useCopy ? s.slice() : s, action);
	}

}

export default List;