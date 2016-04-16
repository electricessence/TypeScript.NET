/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="Enumeration/IEnumerable.d.ts"/>

interface IReadOnlyCollection<T> extends IEnumerable<T>
{
	count:number;
	isReadOnly:boolean;
	
	contains(item:T):boolean;
	copyTo(array:T[], index?:number):T[];
	toArray():T[];
}