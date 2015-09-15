/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

///<reference path="../System/Collections/Enumeration/IEnumerable"/>
///<reference path="IGrouping"/>

interface ILookup<TKey, TElement> extends IEnumerable<IGrouping<TKey, TElement>>
{
	count: number;
	get(key:TKey): TElement[];
	contains(key:TKey): boolean;
}
