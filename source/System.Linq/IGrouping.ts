/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../System/Collections/Enumeration/IEnumerable"/>

interface IGrouping<TKey, TElement>
extends IEnumerable<TElement>
{
	key: TKey;
}
