/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="Enumeration/IEnumerable.d.ts"/>

interface ICollection<T> extends IEnumerable<T>
{
	count: number;
	isReadOnly: boolean;

	add(item:T): void;
	clear(): number;
	contains(item:T): boolean;
	copyTo(array:T[], index?:number): T[];
	toArray():T[];
	remove(item:T): number;  // Number of times removed.
}
