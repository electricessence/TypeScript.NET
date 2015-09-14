/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


///<reference path="../System/Collections/Enumeration/IEnumerable"/>
///<reference path="IGrouping"/>
import ArrayEnumerable= require('./ArrayEnumerable');
'use strict';


class Grouping<TKey, TElement> extends ArrayEnumerable<TElement> implements IGrouping<TKey, TElement>
{

	constructor(private _groupKey:TKey, elements:TElement[])
	{
		super(elements);
	}

	get key():TKey
	{
		return this._groupKey;
	}
}


export = Grouping;