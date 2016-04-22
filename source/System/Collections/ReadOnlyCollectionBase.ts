/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IReadOnlyCollection.d.ts"/>
///<reference path="Enumeration/IEnumerator.d.ts"/>

import CollectionBase from "./CollectionBase";

abstract class ReadOnlyCollectionBase<T>
extends CollectionBase<T>
{

	protected _getCount:()=>number;
	protected getCount():number
	{
		return this._getCount();
	}

	protected getIsReadOnly():boolean
	{
		return true;
	}

	protected _addInternal(entry:T):boolean
	{
		return false;
	}

	protected _removeInternal(entry:T, max?:number):number
	{
		return 0;
	}

	protected _clearInternal():number
	{
		return 0;
	}

	protected _getEnumerator:()=>IEnumerator<T>;
	getEnumerator():IEnumerator<T> {
		return this._getEnumerator();
	}

}

export default ReadOnlyCollectionBase;