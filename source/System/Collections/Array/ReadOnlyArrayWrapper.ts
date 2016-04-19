/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import * as ArrayUtility from "./Utility";
import ArgumentNullException from "../../Exceptions/ArgumentNullException";
import {from as enumeratorFrom} from "../Enumeration/Enumerator";
import ReadOnlyCollection from "../ReadOnlyCollectionBase";

export default class ReadOnlyArrayWrapper<T> extends ReadOnlyCollection<T>
{

	constructor(a:IArray<T>)
	{
		super();
		if(!a)
			throw new ArgumentNullException('collection');

		var _ = this;
		_._getCount = () => a.length;
		_.contains = item => ArrayUtility.contains(a, item);
		_.copyTo = (array:T[], index?:number) => ArrayUtility.copyTo(a, array, 0, index);
		_.getEnumerator = () => enumeratorFrom(a);
		_.getValueAt = i => a[i];
	}

	getValueAt:(index:number)=>T;
}
