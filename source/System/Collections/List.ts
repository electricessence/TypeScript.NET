/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="ICollection.d.ts"/>

// A means for interfacing an array with ICollection<T> and for use as a base class.
import ArrayEnumerator from "./Enumeration/ArrayEnumerator";
import {areEqual} from "../Compare";
import {remove, indexOf, contains, copyTo, removeIndex} from "./Array/Utility";
import {forEach} from "./Enumeration/Enumerator";
export default class List<T> implements IList<T>, IEnumerateEach<T>
{
	protected _source:T[];

	constructor(
		source?:IEnumerableOrArray<T>,
		private _equalityComparer:EqualityComparison<T> = areEqual)
	{
		if(Array.isArray(source))
			this._source = source.slice();
		else
		{
			this._source = [];
			this.importValues(source);
		}
	}


	protected _onModified():void {}


	get count():number
	{
		return this._source.length;
	}

	get isReadOnly():boolean
	{
		return false;
	}

	add(item:T):void
	{
		this._source.push(item);
		this._onModified();
	}

	importValues(values:IEnumerableOrArray<T>):void
	{
		forEach(values, v=> { this._source.push(v); });
		this._onModified();
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
		} else {
			this._source[index] = value;
		}
		this._onModified();
	}

	removeAt(index:number):boolean
	{
		if(removeIndex(this._source,index)) {
			this._onModified();
			return true;
		}
		return false;
	}

	remove(item:T):number
	{
		var n = remove(
			this._source, item, Infinity,
			this._equalityComparer);
		this._onModified();
		return n;
	}

	clear():number
	{
		var len = this._source.length;
		this._source.length = 0;
		return len;
	}

	contains(item:T):boolean
	{
		return contains(
			this._source, item,
			this._equalityComparer);
	}

	copyTo(array:T[], index?:number):T[]
	{
		return copyTo(this._source, array, 0, index);
	}

	toArray():T[]
	{
		return this.copyTo([]);
	}

	getEnumerator():IEnumerator<T>
	{
		return new ArrayEnumerator(this._source);
	}

	forEach(action:Predicate<T>|Action<T>, useCopy?:boolean):void
	{
		var s = this._source;
		forEach(useCopy?s.slice():s,action);
	}

}