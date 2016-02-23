/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IArray.d.ts"/>
///<reference path="../../FunctionTypes.d.ts"/>
import Type from '../../Types';
import Integer from '../../Integer';
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
	CBN = 'Cannot be null.',
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
 * @param {function?} equalityComparer
 * @returns {boolean}
 */
export function contains<T>(
	array:IArray<T>, item:T,
	equalityComparer:EqualityComparison<T> = areEqual):boolean
{
	if(array && array.length)
	{

		if(Array.isArray(array)) return array.indexOf(item)!= -1;

		for(let i = 0; i<array.length; ++i)
		{
			// 'areEqual' includes NaN==NaN evaluation.
			if(equalityComparer(array[i], item))
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
		else if(max<0)
			throw new ArgumentOutOfRangeException('max', max, CBL0);

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
	Integer.assert(index, 'index');
	Integer.assert(index, 'length');

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
	for(let i = 0; i<len; ++i)
	{
		if((i)in(array) && predicate(array[i]))
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
		throw new ArgumentNullException('source', CBN);

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
		throw new ArgumentNullException('target', CBN);

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
	if(!array)
		throw new ArgumentNullException('array', CBN);

	var count = 0;
	if(array && array.length && max!==0)
	{
		if(!max)
			max = Infinity;
		else if(max<0)
			throw new ArgumentOutOfRangeException('max', max, CBL0);

		for(let i = (array.length - 1); i>=0; --i)
		{
			if(equalityComparer(array[i], value))
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
	Integer.assert(count, 'count');
	if(count<0) throw new ArgumentOutOfRangeException('count', count, CBL0);

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
		if(Array.isArray(x))
		{
			if(recurseDepth>0) x = flatten(x, recurseDepth - 1);
			for(var n = 0; n<x.length; n++) result.push(x[n]);
		}
		else result.push(x);
	}
	return result;
}

interface DispatchErrorHandler
{
	(ex?:any, i?:number):void;
}

/**
 * Simply takes a payload and passes it to all the listeners.
 *
 * While dispatching:
 * * This is an unsafe method if by chance any of the listeners modify the array.
 * * It cannot prevent changes to the payload.
 *
 * Improving safety:
 * * Only use a local array that isn't exposed to the listeners.
 * * Use the dispatch method instead as it makes a copy of the listeners array.
 * * Freeze the listeners array so it can't be modified.
 * * Freeze the payload.
 *
 * Specifying trap will catch any errors and pass them along if trap is a function.
 * A payload is used instead of arguments for easy typing.
 *
 *
 * @param listeners
 * @param payload
 * @param trap
 */
export function dispatchUnsafe<T>(
	listeners:IArray<(payload:T)=>any>,
	payload:T, trap?:boolean|DispatchErrorHandler):void
{
	if(listeners && listeners.length)
	{
		for(let i = 0, len = listeners.length; i<len; i++)
		{
			let fn:Function = listeners[i];
			if(!fn) continue; // Ignore null refs.
			try
			{
				fn(payload);
			}
			catch(ex)
			{
				if(!trap)
					throw ex;
				else if(Type.isFunction(trap))
					trap(ex, i);
			}
		}
	}
}

/**
 * Simply takes a payload and passes it to all the listeners.
 * Makes a copy of the listeners before calling dispatchUnsafe.
 *
 * @param listeners
 * @param payload
 * @param trap
 */
export function dispatch<T>(
	listeners:IArray<(payload:T)=>any>,
	payload:T, trap?:boolean|DispatchErrorHandler):void
{
	dispatchUnsafe(copy(listeners), payload, trap);
}

/**
 * Simply takes a payload and passes it to all the listeners.
 * Returns the results in an array that matches the indexes of the listeners.
 *
 * @param listeners
 * @param payload
 * @param trap
 * @returns {any}
 */
export function dispatchMapped<T,TResult>(
	listeners:IArray<(payload:T)=>TResult>,
	payload:T, trap?:boolean|DispatchErrorHandler):TResult[]
{

	if(!listeners) return null;
	// Reuse the copy as the array result.
	var result:any[] = copy(listeners);
	if(listeners.length)
	{

		for(let i = 0, len = result.length; i<len; i++)
		{
			let fn:Function = result[i];
			try
			{
				result[i] = fn // Ignore null refs.
					? fn(payload)
					: undefined;
			}
			catch(ex)
			{
				result[i] = undefined;
				if(!trap)
					throw ex;
				else if(Type.isFunction(trap))
					trap(ex, i);
			}
		}
	}

	return result;

}