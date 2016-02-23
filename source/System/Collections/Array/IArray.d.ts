/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

// Is interchangeable with Array, but also allows for other similar constructs.
interface IArray<T> // ArrayLike<T>
{
	length: number;
	[index: number]: T;
}
