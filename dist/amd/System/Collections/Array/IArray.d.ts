/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export interface ArrayLikeWritable<T> {
	length: number;
	[n: number]: T;
}

/*
  https://github.com/Microsoft/TypeScript/issues/11226
  Strange decisions around ArrayLike<T>.
 */

export type IArray<T> = T[] | ArrayLikeWritable<T>;

export default IArray;