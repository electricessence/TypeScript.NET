/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

///<reference path="IArray.ts"/>
import Types = require('../../Types');
'use strict';

/// Array Utility
module Utility
{

	export function initialize<T>(length:number):T[]
	{
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

	// Special forEach usage that will exit if the callback value === false.


	export function copy<T>(
		sourceArray:T[],
		sourceIndex:number = 0,
		length:number = Infinity):T[]
	{
		if(!sourceArray)
			return sourceArray; // may have passed zero? undefined? or null?

		var sourceLength = sourceArray.length;

		return (sourceIndex || length<sourceLength)
			? sourceArray.slice(sourceIndex, Math.min(length, sourceLength) - sourceLength)
			: sourceArray.slice(0);
	}

	export function copyTo<T>(
		sourceArray:T[],
		destinationArray:T[],
		sourceIndex:number = 0,
		destinationIndex:number = 0,
		length:number = Infinity):void
	{
		if(!sourceArray)
			throw new Error("ArgumentNullException: source array cannot be null.");

		if(!destinationArray)
			throw new Error("ArgumentNullException: destination array cannot be null.");

		if(sourceIndex<0)
			throw new Error("ArgumentOutOfRangeException: source index cannot be less than zero.");

		var sourceLength = sourceArray.length;
		if(sourceIndex>=sourceLength)
			throw new Error("ArgumentOutOfRangeException: the source index must be less than the length of the source array.");

		if(destinationArray.length<0)
			throw new Error("ArgumentOutOfRangeException: destination index cannot be less than zero.");

		var maxLength = sourceArray.length - sourceIndex;
		if(isFinite(length) && length>maxLength)
			throw new Error("ArgumentOutOfRangeException: source index + length cannot exceed the length of the source array.");

		length = Math.min(length, maxLength);

		for(var i = 0; i<length; ++i)
		{
			destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
		}
	}


	export function contains<T>(array:T[], item:T):boolean
	{ return !array ? false : array.indexOf(item)!= -1; }

	export function replace<T>(
		array:T[],
		old:T,
		newValue:T,
		max?:number):number
	{

		var count = 0 | 0;
		if(max!==0)
		{
			if(!max)
				max = Infinity;

			for(var i = (array.length - 1) | 0; i>=0; --i)
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

	export function updateRange<T>(
		array:T[],
		value:T,
		index:number,
		length:number):void
	{
		var end = index + length;
		for(var i:number = index; i<end; ++i)
		{
			array[i] = value;
		}
	}

	export function clear(
		array:any[],
		index:number,
		length:number):void
	{
		updateRange(array, null, index, length);
	}

	export function register<T>(array:T[], item:T):boolean
	{
		if(!array)
			throw new Error("ArgumentNullException: 'array' cannot be null.");
		var len = array.length; // avoid querying .length more than once. *
		var ok = !len || !contains(array, item);
		if(ok) array[len] = item; // * push would query length again.
		return ok;
	}

	export function findIndex<T>(array:IArray<T>, predicate:(item:T) => boolean):number
	{
		if(!array)
			throw new Error("ArgumentNullException: 'array' cannot be null.");
		if(!Types.isFunction(predicate))
			throw new Error("InvalidArgumentException: 'predicate' must be a function.");
		var len = array.length | 0;
		for(var i = 0 | 0; i<len; ++i)
		{
			if(i in array && predicate(array[i]))
				return i;
		}

		return -1;

	}


	// Allows for using "false" to cause forEach to break.
	export function forEach<T>(sourceArray:T[], fn:(value:T, index?:number) => any):void
	{
		sourceArray.every((value:T, index:number) => fn(value, index)!==false);
	}


	export function applyTo<T extends IArray<number>>(target:T, fn:(a:number) => number):T
	{
		if(!target)
			throw new Error("ArgumentNullException: 'target' cannot be null.");

		if(fn)
		{
			for(var i = 0 | 0; i<target.length; ++i)
			{
				target[i] = fn(target[i]);
			}
		}
		return target;
	}

	export function removeIndex<T>(array:T[], index:number):boolean
	{
		if(!array)
			throw new Error("ArgumentNullException: 'array' cannot be null.");

		var exists = index<array.length;
		if(exists)
			array.splice(index, 1);
		return exists;
	}

	export function remove<T>(array:T[], value:T, max?:number):number
	{
		if(!array)
			throw new Error("ArgumentNullException: 'array' cannot be null.");

		var count = 0;
		if(array && array.length && max!==0)
		{
			if(!max)
				max = Infinity;

			for(var i = (array.length - 1) | 0; i>=0; --i)
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

	export function repeat<T>(element:T, count:number):T[]
	{
		var result:T[] = [];
		while(count--)
		{
			result.push(element);
		}

		return result;
	}


}

export = Utility;
