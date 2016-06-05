/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {ArgumentNullException} from "../Exceptions/ArgumentNullException";
import {ReadOnlyCollectionBase} from "./ReadOnlyCollectionBase";
import {ICollection} from "./ICollection";
import __extendsImport from "../../extends";
const __extends = __extendsImport;

export default class ReadOnlyCollectionWrapper<T> extends ReadOnlyCollectionBase<T>
{
	constructor(c:ICollection<T>)
	{
		super();

		if(!c)
			throw new ArgumentNullException('collection');

		var _ = this;
		_._getCount = ()=>c.count;
		_.getEnumerator = ()=> c.getEnumerator();
	}
}
