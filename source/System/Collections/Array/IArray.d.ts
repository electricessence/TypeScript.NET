/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

// Is interchangeable with Array, but also allows for other similar constructs.
export interface IArrayLike<T> // ArrayLike<T>
{
	length: number;
	[index: number]: T;
}

export type IArray<T> = T[] | IArrayLike<T>;

export default IArray;