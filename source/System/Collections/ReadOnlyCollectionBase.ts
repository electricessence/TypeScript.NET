/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IReadOnlyCollection.d.ts"/>
///<reference path="Enumeration/IEnumerator.d.ts"/>

abstract class ReadOnlyCollectionBase<T> implements IReadOnlyCollection<T>
{
	protected _getCount:()=>number;

	get count():number
	{
		return this._getCount();
	}

	get isReadOnly():boolean
	{
		return true;
	}

	contains:(item:T)=>boolean;
	copyTo:(array:T[], index?:number)=>T[];
	getEnumerator:()=>IEnumerator<T>;

	toArray():T[]
	{
		return this.copyTo([]);
	}
}

export default ReadOnlyCollectionBase;