/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IEnumerator.d.ts"/>

interface IEnumerable<T>
{
	getEnumerator(): IEnumerator<T>;
}
