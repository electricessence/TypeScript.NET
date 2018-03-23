/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import ArrayLikeWritable from "./ArrayLikeWritable";
import updateRange from "./updateRange";

/**
 * Clears (sets to null) values of an array across a range of indexes.
 * @param array
 * @param start
 * @param stop
 */
export default function clearElements(
	array:ArrayLikeWritable<any>,
	start:number = 0,
	stop?:number):void
{
	updateRange(array, null, start, stop);
}