/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import ArrayLikeWritable from "./ArrayLikeWritable";
import ArgumentNullException from "../../Exceptions/ArgumentNullException";
import ArgumentOutOfRangeException from "../../Exceptions/ArgumentOutOfRangeException";
import Integer from "../../Integer";

const
	SOURCE = 'source',
	DESTINATION = 'destination',
	SOURCE_INDEX = 'sourceIndex',
	DESTINATION_INDEX = 'destinationIndex';

/**
 * Copies one array to another.
 * @param source
 * @param destination
 * @param sourceIndex
 * @param destinationIndex
 * @param length An optional limit to stop copying.
 * @returns The destination array.
 */
export default function copyArrayTo<T,TDestination extends ArrayLikeWritable<T>>(
	source:ArrayLike<T>,
	destination:TDestination,
	sourceIndex:number = 0,
	destinationIndex:number = 0,
	length:number = Infinity):TDestination
{
	if(!source)
		throw new ArgumentNullException(SOURCE);

	if(!destination)
		throw new ArgumentNullException(DESTINATION);

	Integer.assertZeroOrGreater(sourceIndex, SOURCE_INDEX);

	let sourceLength = source.length;
	if(!sourceLength)
		return destination;
	if(sourceIndex>=sourceLength)
		throw new ArgumentOutOfRangeException(SOURCE_INDEX, sourceIndex, 'Must be less than the length of the source array.');

	Integer.assertZeroOrGreater(destinationIndex, DESTINATION_INDEX);

	const maxLength = source.length - sourceIndex;
	if(isFinite(length) && length>maxLength)
		throw new ArgumentOutOfRangeException(SOURCE_INDEX, sourceIndex, 'Source index + length cannot exceed the length of the source array.');

	length = Math.min(length, maxLength);
	const newLength = destinationIndex + length;
	if(newLength>destination.length) destination.length = newLength;

	for(let i = 0; i<length; i++)
		destination[destinationIndex + i] = source[sourceIndex + i];

	return destination;
}
