/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="ICollection.d.ts"/>

// A means for interfacing an array with ICollection<T> and for use as a base class.
import ArrayEnumerator from "./Enumeration/ArrayEnumerator";
import {areEqual} from "../Compare";
import {remove, contains, copyTo} from "./Array/Utility";
export default class ArrayCollection<T> implements ICollection<T>
{
	constructor(
		protected _source:T[] = [],
		private _equalityComparer:EqualityComparison<T> = areEqual)
	{
	}

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
	}

	remove(item:T):number
	{
		return remove(
			this._source, item, Infinity,
			this._equalityComparer);
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
		return copyTo(this._source,array,0,index);
	}

	toArray():T[]
	{
		return this.copyTo([]);
	}

	getEnumerator():IEnumerator<T>
	{
		return new ArrayEnumerator(this._source);
	}

}