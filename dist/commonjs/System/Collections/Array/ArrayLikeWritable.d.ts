/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export interface ArrayLikeWritable<T> {
	length: number;
	[n: number]: T;
}

export default ArrayLikeWritable;