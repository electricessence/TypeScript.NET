/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import CollectionBase from "./CollectionBase";
import IEnumerator from "./Enumeration/IEnumerator";
import __extendsImport from "../../extends";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

export abstract class ReadOnlyCollectionBase<T>
extends CollectionBase<T>
{

	protected abstract _getCount():number;

	protected getCount():number
	{
		return this._getCount();
	}

	protected getIsReadOnly():boolean
	{
		return true;
	}

	//noinspection JSUnusedLocalSymbols
	protected _addInternal(entry:T):boolean
	{
		return false;
	}

	//noinspection JSUnusedLocalSymbols
	protected _removeInternal(entry:T, max?:number):number
	{
		return 0;
	}

	protected _clearInternal():number
	{
		return 0;
	}

	protected abstract _getEnumerator():IEnumerator<T>;

	getEnumerator():IEnumerator<T>
	{
		return this._getEnumerator();
	}

}

export default ReadOnlyCollectionBase;