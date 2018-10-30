/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {ArrayEnumerable} from "../Linq";

export default class Grouping<TKey, TElement>
	extends ArrayEnumerable<TElement>
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