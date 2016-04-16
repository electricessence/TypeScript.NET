/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IReadOnlyCollection.d.ts"/>

interface ICollection<T> extends IReadOnlyCollection<T>
{
	add(item:T): void;
	remove(item:T): number;  // Number of times removed.
	clear(): number;
}
