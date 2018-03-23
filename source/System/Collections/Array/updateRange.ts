/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import ArgumentOutOfRangeException from "../../Exceptions/ArgumentOutOfRangeException";
import Integer from "../../Integer";
import ArrayLikeWritable from "./ArrayLikeWritable";

/**
 * Replaces values of an array across a range of indexes.
 * @param array
 * @param value
 * @param start
 * @param stop
 */
export default function updateRange<T>(
	array:ArrayLikeWritable<T>,
	value:T,
	start:number = 0,
	stop?:number):void
{
	if(!array) return;
	Integer.assertZeroOrGreater(start, 'start');
	if(!stop && stop!==0) stop = array.length;
	Integer.assert(stop, 'stop');
	if(stop<start) throw new ArgumentOutOfRangeException("stop", stop, "is less than start");

	for(let i:number = start; i<stop; i++)
	{
		array[i] = value;
	}
}
