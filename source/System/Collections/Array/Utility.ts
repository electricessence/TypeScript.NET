/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IArray.d.ts"/>
///<reference path="../../FunctionTypes.d.ts"/>
import Types from '../../Types';
import {areEqual} from '../../Compare';
import ArgumentException from '../../Exceptions/ArgumentException';
import ArgumentNullException from '../../Exceptions/ArgumentNullException';
import ArgumentOutOfRangeException from '../../Exceptions/ArgumentOutOfRangeException';

/**
 * Initializes an array depending on the requested capacity.
 * The returned array will have a .length equal to the value provided.
 * @param length
 * @returns {T[]}
 */
export function initialize<T>(length:number):T[]
{
	// This logic is based upon JS performance tests that show a significant difference at the level of 65536.
	var array:T[];
	if(length>65536)
		array = new Array(length);
	else
	{
		array = [];
		array.length = length;
	}
	return array;
}

/**
 *
 * @param source
 * @param sourceIndex
 * @param length
 * @returns {any}
 */
export function copy<T>(
	source:IArray<T>,
	sourceIndex:number = 0,
	length:number = Infinity):IArray<T>
{
	if(!source) return source; // may have passed zero? undefined? or null?
	return copyTo<T>(
		source,
		initialize<T>(Math.min(length, Math.max(source.length - sourceIndex, 0))),
		sourceIndex, 0, length);
}

const
CBN  = 'Cannot be null.',
CBL0 = 'Cannot be less than zero.';

/**
 * Copies one array to another.
 * @param source
 * @param destination
 * @param sourceIndex
 * @param destinationIndex
 * @param length An optional limit to stop copying.
 * @returns The destination array.
 */
export function copyTo<T>(
	source:IArray<T>,
	destination:IArray<T>,
	sourceIndex:number = 0,
	destinationIndex:number = 0,
	length:number = Infinity):IArray<T>
{
	if(!source)
		throw new ArgumentNullException('source', CBN);

	if(!destination)
		throw new ArgumentNullException('destination', CBN);

	if(sourceIndex<0)
		throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, CBL0);

	var sourceLength = source.length;
	if(sourceIndex>=sourceLength)
		throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, 'Must be less than the length of the source array.');

	if(destination.length<0)
		throw new ArgumentOutOfRangeException('destinationIndex', destinationIndex, CBL0);

	var maxLength = source.length - sourceIndex;
	if(isFinite(length) && length>maxLength)
		throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, 'Source index + length cannot exceed the length of the source array.');

	length = Math.min(length, maxLength);

	for(let i = 0; i<length; ++i)
	{
		destination[destinationIndex + i] = source[sourceIndex + i];
	}

	return destination;
}

/**
 * Checks to see if the provided array contains an item.
 * If the array value is null, then false is returned.
 * @param array
 * @param item
 * @returns {boolean}
 */
export function contains<T>(array:IArray<T>, item:T):boolean
{
	if(array && array.length)
	{

		if(array instanceof Array) return array.indexOf(item)!= -1;

		for(let i = 0; i<array.length; ++i)
		{
			// 'areEqual' includes NaN==NaN evaluation.
			if(areEqual(array[i], item))
				return true;
		}
	}

	return false;
}

/**
 * Finds and replaces a value from an array.  Will replaces all instances unless a maximum is specified.
 * @param array
 * @param old
 * @param newValue
 * @param max
 * @returns {number}
 */
export function replace<T>(
	array:IArray<T>,
	old:T,
	newValue:T,
	max?:number):number
{

	var count = 0;
	if(max!==0)
	{
		if(!max)
			max = Infinity;

		for(let i = (array.length - 1); i>=0; --i)
		{
			if(array[i]===old)
			{
				array[i] = newValue;
				++count;
				if(!--max)
					break;
			}
		}
	}

	return count;

}

/**
 * Replaces values of an array across a range of indexes.
 * @param array
 * @param value
 * @param index
 * @param length
 */
export function updateRange<T>(
	array:T[],
	value:T,
	index:number,
	length:number):void
{
	var end = index + length;
	for(let i:number = index; i<end; ++i)
	{
		array[i] = value;
	}
}

/**
 * Clears (sets to null) values of an array across a range of indexes.
 * @param array
 * @param index
 * @param length
 */
export function clear(
	array:any[],
	index:number,
	length:number):void
{
	updateRange(array, null, index, length);
}

/**
 * Ensures a value exists within an array.  If not found, adds to the end.
 * @param array
 * @param item
 * @returns {boolean}
 */
export function register<T>(array:IArray<T>, item:T):boolean
{
	if(!array)
		throw new ArgumentNullException('array', CBN);
	var len = array.length; // avoid querying .length more than once. *
	var ok = !len || !contains(array, item);
	if(ok) array[len] = item; // * push would query length again.
	return ok;
}

/**
 * Returns the first index of which the provided predicate returns true.
 * Returns -1 if always false.
 * @param array
 * @param predicate
 * @returns {number}
 */
export function findIndex<T>(array:IArray<T>, predicate:Predicate<T>):number
{
	if(!array)
		throw new ArgumentNullException('array', CBN);
	if(!Types.isFunction(predicate))
		throw new ArgumentException('predicate', 'Must be a function.');
	var len = array.length;
	for(let i = 0; i<len; ++i)
	{
		if(i in array && predicate(array[i]))
			return i;
	}

	return -1;
}


/**
 * Allows for using "false" to cause forEach to break.
 * Can also be applied to a structure that indexes like an array, but may not be.
 * @param source
 * @param fn
 * @returns {IArray<T>}
 */
export function forEach<T>(
	source:IArray<T>,
	fn:(value:T, index?:number) => (void|boolean)):IArray<T>
{
	if(!source)
		throw new Error("ArgumentNullException: 'source' cannot be null.");

	if(fn)
	{
		for(let i = 0; i<source.length; ++i)
		{
			if(fn(source[i])===false)
				break;
		}
	}
	return source;
}


/**
 * Is similar to Array.map() but instead of returning a new array, it updates the existing indexes.
 * Can also be applied to a structure that indexes like an array, but may not be.
 * @param target
 * @param fn
 * @returns {IArray<T>}
 */
export function applyTo<T>(target:IArray<T>, fn:(a:T) => T):IArray<T>
{
	if(!target)
		throw new Error("ArgumentNullException: 'target' cannot be null.");

	if(fn)
	{
		for(let i = 0; i<target.length; ++i)
		{
			target[i] = fn(target[i]);
		}
	}
	return target;
}

/**
 * Removes an entry at a specified index.
 * @param array
 * @param index
 * @returns {boolean} True if the value was able to be removed.
 */
export function removeIndex<T>(array:T[], index:number):boolean
{
	if(!array)
		throw new Error("ArgumentNullException: 'array' cannot be null.");

	var exists = index<array.length;
	if(exists)
		array.splice(index, 1);
	return exists;
}

/**
 * Finds and removes a value from an array.  Will remove all instances unless a maximum is specified.
 * @param array
 * @param value
 * @param max
 * @returns {number} The number of times the value was found and removed.
 */
export function remove<T>(array:T[], value:T, max?:number):number
{
	if(!array)
		throw new Error("ArgumentNullException: 'array' cannot be null.");

	var count = 0;
	if(array && array.length && max!==0)
	{
		if(!max)
			max = Infinity;

		for(let i = (array.length - 1); i>=0; --i)
		{
			if(array[i]===value)
			{
				array.splice(i, 1);
				++count;
				if(!--max)
					break;
			}
		}
	}

	return count;
}

/**
 * Simply repeats a value the number of times specified.
 * @param element
 * @param count
 * @returns {T[]}
 */
export function repeat<T>(element:T, count:number):T[]
{
	var result:T[] = [];
	while(count--)
	{
		result.push(element);
	}

	return result;
}

/**
 * Takes any arrays within an array and inserts the values contained within in place of that array.
 * For every count higher than 0 in recurseDepth it will attempt an additional pass.  Passing Infinity will flatten all arrays contained.
 * @param a
 * @param recurseDepth
 * @returns {any[]}
 */
export function flatten(a:any[], recurseDepth:number = 0):any[]
{
	var result:any[] = [];
	for(var i = 0; i<a.length; i++)
	{
		var x = a[i];
		if(x instanceof Array)
		{
			if(recurseDepth>0) x = flatten(x, recurseDepth-1);
			for(var n = 0; n<x.length; n++) result.push(x[n]);
		}
		else result.push(x);
	}
	return result;
}
