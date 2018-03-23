/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import ArgumentNullException from "../Exceptions/ArgumentNullException";
import ReadOnlyCollectionBase from "./ReadOnlyCollectionBase";
import ICollection from "./ICollection";
import IEnumerator from "./Enumeration/IEnumerator";
import {from as enumeratorFrom} from "./Enumeration/Enumerator";
import isArrayLike from "../Reflection/isArrayLike";

export default class ReadOnlyCollectionWrapper<T> extends ReadOnlyCollectionBase<T>
{
	constructor(collection:ICollection<T>|ArrayLike<T>)
	{
		super();

		if(!collection)
			throw new ArgumentNullException('collection');

		const _ = this;
		// Attempting to avoid contact with the original collection.
		if(isArrayLike(collection))
		{
			this.__getCount = ()=>collection.length;
			this.__getEnumerator = ()=> enumeratorFrom(collection);
		} else {
			this.__getCount = ()=>collection.count;
			this.__getEnumerator = ()=> collection.getEnumerator();
		}

	}

	private readonly __getCount:()=>number;
	private readonly __getEnumerator:()=>IEnumerator<T>;

	protected _getCount():number
	{
		this.throwIfDisposed();
		return this.__getCount();
	}

	protected _getEnumerator():IEnumerator<T>
	{
		this.throwIfDisposed();
		return this.__getEnumerator();
	}

	protected _onDispose()
	{
		super._onDispose();
		const _:any = this;
		_.__getCount = null;
		_.__getEnumerator = null;
	}

}
