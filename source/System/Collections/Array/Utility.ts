/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import Type from "../../Types";
import Integer from "../../Integer";
import {areEqual} from "../../Compare";
import ArgumentException from "../../Exceptions/ArgumentException";
import ArgumentNullException from "../../Exceptions/ArgumentNullException";
import ArgumentOutOfRangeException from "../../Exceptions/ArgumentOutOfRangeException";
import {
	ActionWithIndex,
	EqualityComparison,
	PredicateWithIndex,
	SelectorWithIndex
} from "../../FunctionTypes";
import ArrayLikeWritable from "./ArrayLikeWritable";
import initialize from "./initialize";
import {copy, copyTo} from "./copy";
export {initialize, copy, copyTo};

const
	CBN  = 'Cannot be null.',
	CB0  = 'Cannot be zero.',
	CBL0 = 'Cannot be less than zero.',
	VFN  = 'Must be a valid finite number';


/**
 * Checks to see where the provided array contains an item/value.
 * If the array value is null, then -1 is returned.
 * @param array
 * @param item
 * @param {function?} equalityComparer
 * @returns {number}
 */
export function indexOf<T>(
	array:ArrayLike<T>, item:T,
	equalityComparer:EqualityComparison<T> = areEqual):number
{

	const len = array && array.length;
	if(len)
	{
		// NaN NEVER evaluates its equality so be careful.
		if((array) instanceof (Array) && !Type.isTrueNaN(item))
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
	array:ArrayLike<T>, item:T,
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
	array:ArrayLikeWritable<T>,
	old:T,
	newValue:T,
	max:number = Infinity):number
{
	if(!array || !array.length || max===0) return 0;
	if(max<0) throw new ArgumentOutOfRangeException('max', max, CBL0);
	if(!max) max = Infinity; // just in case.

	let count = 0;

	for(let i = 0, len = array.length; i<len; i++)
	{
		if(array[i]===old)
		{
			(<any>array)[i] = newValue;
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
	array:ArrayLike<T>,
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
		(<any>array)[i] = value;
	}
}

/**
 * Clears (sets to null) values of an array across a range of indexes.
 * @param array
 * @param start
 * @param stop
 */
export function clear(
	array:ArrayLikeWritable<any>,
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
	array:ArrayLikeWritable<T>, item:T,
	equalityComparer:EqualityComparison<T> = areEqual):boolean
{
	if(!array)
		throw new ArgumentNullException('array', CBN);
	let len = array.length; // avoid querying .length more than once. *
	const ok = !len || !contains(array, item, equalityComparer);
	if(ok) (<any>array)[len] = item; // * push would query length again.
	return ok;
}

/**
 * Returns the first index of which the provided predicate returns true.
 * Returns -1 if always false.
 * @param array
 * @param predicate
 * @returns {number}
 */
export function findIndex<T>(array:ArrayLike<T>, predicate:PredicateWithIndex<T>):number
{
	if(!array)
		throw new ArgumentNullException('array', CBN);
	if(!Type.isFunction(predicate))
		throw new ArgumentException('predicate', 'Must be a function.');

	const len = array.length;
	if(!Type.isNumber(len, true) || len<0)
		throw new ArgumentException('array', 'Does not have a valid length.');

	if((array) instanceof (Array))
	{
		for(let i = 0; i<len; i++)
		{
			if(predicate(array[i], i))
				return i;
		}
	}
	else
	{
		for(let i = 0; i<len; i++)
		{
			if((i) in (array) && predicate(array[i], i))
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
	source:ArrayLike<T>,
	action:ActionWithIndex<T>):void
export function forEach<T>(
	source:ArrayLike<T>,
	action:PredicateWithIndex<T>):void
export function forEach<T>(
	source:ArrayLike<T>,
	action:ActionWithIndex<T> | PredicateWithIndex<T>):void
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
export function applyTo<T>(target:ArrayLikeWritable<T>, fn:SelectorWithIndex<T,T>):void
{
	if(target && fn)
	{
		for(let i = 0; i<target.length; i++)
		{
			(<any>target)[i] = fn(target[i], i);
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


	const exists = index<array.length;
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
	array:T[], value:T, max:number = Infinity,
	equalityComparer:EqualityComparison<T> = areEqual):number
{
	if(!array || !array.length || max===0) return 0;
	if(max<0) throw new ArgumentOutOfRangeException('max', max, CBL0);

	let count = 0;
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
		const found:number[] = []; // indexes;
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

	const result = initialize<T>(count);
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

	const result = initialize<number>(count);
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
export function distinct(source:string[]|null):string[];
export function distinct(source:number[]|null):number[];
export function distinct(source:any[]|null):any[]
{
	if(!source) return []; // Allowing for null facilitates regex filtering.
	const seen:any = {};
	return source.filter(e => !(e in seen) && (seen[e] = true));
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
	const result:any[] = [];
	for(let i = 0; i<a.length; i++)
	{
		let x = a[i];
		if((x) instanceof (Array))
		{
			if(recurseDepth>0) x = flatten(x, recurseDepth - 1);
			for(let n = 0; n<x.length; n++) result.push(x[n]);
		}
		else result.push(x);
	}
	return result;
}
