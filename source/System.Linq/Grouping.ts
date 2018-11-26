/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {ArrayEnumerable} from "./Linq";
import IGrouping from "./ILinq/IGrouping";

export { IGrouping }

export default class Grouping<TKey, TElement>
	extends ArrayEnumerable<TElement>
	implements IGrouping<TKey, TElement>
{
	constructor(private readonly _groupKey:TKey, elements:TElement[])
	{
		super(elements);
		// @ts-ignore
		this._disposableObjectName = "Grouping";
	}

	get key():TKey
	{
		return this._groupKey;
	}
}