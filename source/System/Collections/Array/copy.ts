/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import initialize from "./initialize";
import ArrayLikeWritable from "./ArrayLikeWritable";
import ArgumentNullException from "../../Exceptions/ArgumentNullException";
import ArgumentOutOfRangeException from "../../Exceptions/ArgumentOutOfRangeException";

/**
 *
 * @param source
 * @param sourceIndex
 * @param length
 * @returns {any}
 */
export function copy<T>(
	source:ArrayLike<T>,
	sourceIndex:number = 0,
	length:number      = Infinity):T[]
{
	if(!source) return <any>source; // may have passed zero? undefined? or null?
	return copyTo(
		source,
		initialize<T>(Math.min(length, Math.max(source.length - sourceIndex, 0))),
		sourceIndex, 0, length);
}

const
	CBN  = 'Cannot be null.',
	CBL0 = 'Cannot be less than zero.';


export module copy
{
	/**
	 * Copies one array to another.
	 * @param source
	 * @param destination
	 * @param sourceIndex
	 * @param destinationIndex
	 * @param length An optional limit to stop copying.
	 * @returns The destination array.
	 */
	export function to<T, TDestination extends ArrayLikeWritable<T>>(
		source:ArrayLike<T>,
		destination:TDestination,
		sourceIndex:number      = 0,
		destinationIndex:number = 0,
		length:number           = Infinity):TDestination
	{
		return copy.to(source, destination, sourceIndex, destinationIndex, length);
	}
}

/**
 * Copies one array to another.
 * @param source
 * @param destination
 * @param sourceIndex
 * @param destinationIndex
 * @param length An optional limit to stop copying.
 * @returns The destination array.
 */
export function copyTo<T, TDestination extends ArrayLikeWritable<T>>(
	source:ArrayLike<T>,
	destination:TDestination,
	sourceIndex:number      = 0,
	destinationIndex:number = 0,
	length:number           = Infinity):TDestination
{
	if(!source)
		throw new ArgumentNullException('source', CBN);

	if(!destination)
		throw new ArgumentNullException('destination', CBN);

	if(sourceIndex<0)
		throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, CBL0);

	let sourceLength = source.length;
	if(!sourceLength)
		return destination;
	if(sourceIndex>=sourceLength)
		throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, 'Must be less than the length of the source array.');

	if(destination.length<0)
		throw new ArgumentOutOfRangeException('destinationIndex', destinationIndex, CBL0);

	const maxLength = source.length - sourceIndex;
	if(isFinite(length) && length>maxLength)
		throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, 'Source index + length cannot exceed the length of the source array.');

	length = Math.min(length, maxLength);
	const newLength = destinationIndex + length;
	if(newLength>destination.length) destination.length = newLength;

	for(let i = 0; i<length; i++)
	{
		destination[destinationIndex + i] = source[sourceIndex + i];
	}

	return destination;
}

export default copy;
