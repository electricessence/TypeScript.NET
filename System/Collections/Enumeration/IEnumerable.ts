/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

///<reference path="IEnumerator.ts"/>

interface IEnumerable<T>
{
	getEnumerator(): IEnumerator<T>;
}
