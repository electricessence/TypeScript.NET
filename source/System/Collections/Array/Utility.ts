/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Type} from "../../Types";
import {Integer} from "../../Integer";
import {areEqual} from "../../Compare";
import {ArgumentException} from "../../Exceptions/ArgumentException";
import {ArgumentNullException} from "../../Exceptions/ArgumentNullException";
import {ArgumentOutOfRangeException} from "../../Exceptions/ArgumentOutOfRangeException";
import {EqualityComparison, Predicate, Action} from "../../FunctionTypes";
import {IArray} from "./IArray";

/**
 * Initializes an array depending on the requested capacity.
 * The returned array will have a .length equal to the value provided.
 * @param length
 * @returns {T[]}
 */
export function initialize<T>(length:number):T[]
{
	Integer.assert(length, 'length');
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
	length:number = Infinity):T[]
{
	if(!source) return <any>source; // may have passed zero? undefined? or null?
	return copyTo(
		source,
		initialize<T>(Math.min(length, Math.max(source.length - sourceIndex, 0))),
		sourceIndex, 0, length);
}

const
	CBN  = 'Cannot be null.',
	CB0  = 'Cannot be zero.',
	CBL0 = 'Cannot be less than zero.',
	VFN  = 'Must be a valid finite number';

/**
 * Copies one array to another.
 * @param source
 * @param destination
 * @param sourceIndex
 * @param destinationIndex
 * @param length An optional limit to stop copying.
 * @returns The destination array.
 */
export function copyTo<T,TDestination extends IArray<any>>(
	source:IArray<T>,
	destination:TDestination,
	sourceIndex:number = 0,
	destinationIndex:number = 0,
	length:number = Infinity):TDestination
{
	if(!source)
		throw new ArgumentNullException('source', CBN);

	if(!destination)
		throw new ArgumentNullException('destination', CBN);

	if(sourceIndex<0)
		throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, CBL0);

	var sourceLength = source.length;
	if(!sourceLength)
		return destination;
	if(sourceIndex>=sourceLength)
		throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, 'Must be less than the length of the source array.');

	if(destination.length<0)
		throw new ArgumentOutOfRangeException('destinationIndex', destinationIndex, CBL0);

	var maxLength = source.length - sourceIndex;
	if(isFinite(length) && length>maxLength)
		throw new ArgumentOutOfRangeException('sourceIndex', sourceIndex, 'Source index + length cannot exceed the length of the source array.');

	length = Math.min(length, maxLength);
	var newLength = destinationIndex + length;
	if(newLength>destination.length) destination.length = newLength;

	for(let i = 0; i<length; i++)
	{
		destination[destinationIndex + i] = source[sourceIndex + i];
	}

	return destination;
}


/**
 * Checks to see where the provided array contains an item/value.
 * If the array value is null, then -1 is returned.
 * @param array
 * @param item
 * @param {function?} equalityComparer
 * @returns {number}
 */
export function indexOf<T>(
	array:IArray<T>, item:T,
	equalityComparer:EqualityComparison<T> = areEqual):number
{

	var len = array && array.length;
	if(len)
	{
		// NaN NEVER evaluates its equality so be careful.
		if(Array.isArray(array) && !Type.isTrueNaN(item))
			return array.indexOf(item);

		for(let i = 0; i<len; i++)
		{
			// 'areEqual' includes NaN==NaN evaluation.
			if(equalityComparer(array[i], item))
				return i;
		}
	}

	return -1;
}

/**
 * Checks to see if the provided array contains an item.
 * If the array value is null, then false is returned.
 * @param array
 * @param item
 * @param {function?} equalityComparer
 * @returns {boolean}
 */
export function contains<T>(
	array:IArray<T>, item:T,
	equalityComparer:EqualityComparison<T> = areEqual):boolean
{
	return indexOf(array, item, equalityComparer)!= -1;
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
	if(!array || !array.length || max===0) return 0;
	if(max<0) throw new ArgumentOutOfRangeException('max', max, CBL0);
	if(!max) max = Infinity;

	var count = 0;

	for(let i = 0, len = array.length; i<len; i++)
	{
		if(array[i]===old)
		{
			array[i] = newValue;
			++count;
			if(count==max) break;
		}
	}

	return count;

}

/**
 * Replaces values of an array across a range of indexes.
 * @param array
 * @param value
 * @param start
 * @param stop
 */
export function updateRange<T>(
	array:IArray<T>,
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

/**
 * Clears (sets to null) values of an array across a range of indexes.
 * @param array
 * @param start
 * @param stop
 */
export function clear(
	array:IArray<any>,
	start:number = 0,
	stop?:number):void
{
	updateRange(array, null, start, stop);
}

/**
 * Ensures a value exists within an array.  If not found, adds to the end.
 * @param array
 * @param item
 * @param {function?} equalityComparer
 * @returns {boolean}
 */
export function register<T>(
	array:IArray<T>, item:T,
	equalityComparer:EqualityComparison<T> = areEqual):boolean
{
	if(!array)
		throw new ArgumentNullException('array', CBN);
	var len = array.length; // avoid querying .length more than once. *
	var ok = !len || !contains(array, item, equalityComparer);
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
	if(!Type.isFunction(predicate))
		throw new ArgumentException('predicate', 'Must be a function.');

	var len = array.length;
	if(Array.isArray(array))
	{
		for(let i = 0; i<len; i++)
		{
			if(predicate(array[i]))
				return i;
		}
	}
	else
	{
		for(let i = 0; i<len; i++)
		{
			if((i) in (array) && predicate(array[i]))
				return i;
		}
	}


	return -1;
}


/**
 * Allows for using "false" to cause forEach to break.
 * Can also be applied to a structure that indexes like an array, but may not be.
 * @param source
 * @param action
 */
export function forEach<T>(
	source:IArray<T>,
	action:Predicate<T> | Action<T>):void
{
	if(source && action)
	{
		// Don't cache the length since it is possible that the underlying array changed.
		for(let i = 0; i<source.length; i++)
		{
			if(action(source[i], i)===false)
				break;
		}
	}
}


/**
 * Is similar to Array.map() but instead of returning a new array, it updates the existing indexes.
 * Can also be applied to a structure that indexes like an array, but may not be.
 * @param target
 * @param fn
 */
export function applyTo<T>(target:IArray<T>, fn:(a:T) => T):void
{
	if(target && fn)
	{
		for(let i = 0; i<target.length; i++)
		{
			target[i] = fn(target[i]);
		}
	}
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
		throw new ArgumentNullException('array', CBN);

	Integer.assert(index, 'index');
	if(index<0) throw new ArgumentOutOfRangeException('index', index, CBL0);


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
 * @param {function?} equalityComparer
 * @returns {number} The number of times the value was found and removed.
 */
export function remove<T>(
	array:T[], value:T, max?:number,
	equalityComparer:EqualityComparison<T> = areEqual):number
{
	if(!array || !array.length || max===0) return 0;
	if(max<0) throw new ArgumentOutOfRangeException('max', max, CBL0);

	var count = 0;
	if(!max || !isFinite(max))
	{
		// Don't track the indexes and remove in reverse.
		for(let i = (array.length - 1); i>=0; i--)
		{
			if(equalityComparer(array[i], value))
			{
				array.splice(i, 1);
				++count;
			}
		}
	}
	else
	{
		// Since the user will expect it to happen in forward order...
		var found:number[] = []; // indexes;
		for(let i = 0, len = array.length; i<len; i++)
		{
			if(equalityComparer(array[i], value))
			{
				found.push(i);
				++count;
				if(count==max) break;
			}
		}

		for(let i = found.length - 1; i>=0; i--)
		{
			array.splice(found[i], 1);
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
	Integer.assert(count, 'count');
	if(count<0) throw new ArgumentOutOfRangeException('count', count, CBL0);

	var result = initialize<T>(count);
	for(let i = 0; i<count; i++)
	{
		result[i] = element;
	}

	return result;
}

/**
 * Returns a range of numbers based upon the first value and the step value.
 * @param first
 * @param count
 * @param step
 * @returns {number[]}
 */

export function range(
	first:number,
	count:number,
	step:number = 1):number[]
{
	if(isNaN(first) || !isFinite(first)) throw new ArgumentOutOfRangeException('first', first, VFN);
	if(isNaN(count) || !isFinite(count)) throw new ArgumentOutOfRangeException('count', count, VFN);
	if(count<0) throw new ArgumentOutOfRangeException('count', count, CBL0);

	var result = initialize<number>(count);
	for(let i = 0; i<count; i++)
	{
		result[i] = first;
		first += step;
	}

	return result;
}

/**
 * Returns a range of numbers based upon the first value and the step value excluding any numbers at or beyond the until value.
 * @param first
 * @param until
 * @param step
 * @returns {number[]}
 */
export function rangeUntil(
	first:number,
	until:number,
	step:number = 1):number[]
{
	if(step==0) throw new ArgumentOutOfRangeException('step', step, CB0);
	return range(first, (until - first)/step, step);
}

/**
 * Returns a unique reduced set of values.
 * @param source
 */
export function distinct(source:string[]):string[];
export function distinct(source:number[]):number[];
export function distinct(source:any[]):any[]
{
	var seen:any = {};
	return source.filter(e=> !(e in seen) && (seen[e] = true));
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
		if(Array.isArray(x))
		{
			if(recurseDepth>0) x = flatten(x, recurseDepth - 1);
			for(var n = 0; n<x.length; n++) result.push(x[n]);
		}
		else result.push(x);
	}
	return result;
}
