/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import ArgumentNullException from "../Exceptions/ArgumentNullException";
import ReadOnlyCollectionBase from "./ReadOnlyCollectionBase";
import {FiniteIEnumerator} from "./Enumeration/IEnumerator";
import {from as enumeratorFrom} from "./Enumeration/Enumerator";
import {Type} from "../Types";
import IReadOnlyCollection from "./IReadOnlyCollection";

import __extendsImport from "../../extends";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

export default class ReadOnlyCollectionWrapper<T>
	extends ReadOnlyCollectionBase<T>
{
	constructor(collection:IReadOnlyCollection<T> | ArrayLike<T>)
	{
		super();

		if(!collection)
			throw new ArgumentNullException('collection');

		// Attempting to avoid contact with the original collection.
		if(Type.isArrayLike(collection))
		{
			this.__getCount = () => collection.length;
			this.__getEnumerator = () => enumeratorFrom(collection);
		}
		else
		{
			this.__getCount = () => collection.count;
			this.__getEnumerator = () => collection.getEnumerator();
		}

	}

	private __getCount:() => number;
	private __getEnumerator:() => FiniteIEnumerator<T>;

	protected _getCount():number
	{
		this.throwIfDisposed();
		return this.__getCount();
	}

	protected _getEnumerator():FiniteIEnumerator<T>
	{
		this.throwIfDisposed();
		return this.__getEnumerator();
	}

	protected _onDispose()
	{
		super._onDispose();
		this.__getCount = <any>null;
		this.__getEnumerator = <any>null;
	}

}
