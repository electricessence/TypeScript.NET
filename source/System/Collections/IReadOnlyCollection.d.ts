/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="Enumeration/IEnumerable.d.ts"/>

interface IReadOnlyCollection<T>
extends IEnumerable<T>
{
	count:number;
	isReadOnly:boolean;
	
	contains(entry:T):boolean;
	copyTo<TTarget extends IArray<any>>(target:TTarget, index?:number):TTarget;
	toArray():T[];
}