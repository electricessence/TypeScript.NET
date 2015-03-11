///<reference path="../System.ts"/>

module System.Collections.ArrayUtility
{

	export function initialize<T>(length: number): T[]
	{
		var array: T[];
		if (length > 65536)
			array = new Array(length);
		else
		{
			array = [];
			array.length = length;
		}
		return array;
	}

	export function copy<T>(sourceArray: T[], sourceIndex: number = 0, length: number = Infinity): T[]
	{
		if (!sourceArray)
			return sourceArray; // may have passed zero? undefined? or null?

		var sourceLength = sourceArray.length;

		return (sourceIndex || length < sourceLength)
			? sourceArray.slice(sourceIndex, Math.min(length, sourceLength) - sourceLength)
			: sourceArray.slice(0);
	}

	export function copyTo<T>(
		sourceArray: T[],
		destinationArray: T[],
		sourceIndex: number = 0,
		destinationIndex: number = 0,
		length: number = Infinity): void
	{
		if (!sourceArray)
			throw new Error("ArgumentNullException: source array cannot be null.");

		if (!destinationArray)
			throw new Error("ArgumentNullException: destination array cannot be null.");

		if (sourceIndex < 0)
			throw new Error("ArgumentOutOfRangeException: source index cannot be less than zero.");

		var sourceLength = sourceArray.length;
		if (sourceIndex >= sourceLength)
			throw new Error("ArgumentOutOfRangeException: the source index must be less than the length of the source array.");

		if (destinationArray.length < 0)
			throw new Error("ArgumentOutOfRangeException: destination index cannot be less than zero.");

		var maxLength = sourceArray.length - sourceIndex;
		if (isFinite(length) && length > maxLength)
			throw new Error("ArgumentOutOfRangeException: source index + length cannot exceed the length of the source array.");

		length = Math.min(length, maxLength);

		for (var i = 0; i < length; ++i)
			destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
	}


	export function contains<T>(array: T[], item: T): boolean { return !array ? false : array.indexOf(item) != -1; }

	export function replace<T>(array: T[], old: T, newValue: T, max?: number): number
	{

		var count = 0 | 0;
		if (max !== 0)
		{
			if (!max)
				max = Infinity;

			for (var i = (array.length - 1) | 0; i >= 0; --i) if (array[i] === old)
			{
				array[i] = newValue;
				++count;
				if (!--max)
					break;
			}
		}

		return count;

	}

	export function updateRange<T>(
		array: T[],
		value: T,
		index: number,
		length: number): void
	{
		var end = index + length;
		for(var i:number = index; i < end; ++i) {
			array[i] = value;
		}
	}

	export function clear(
		array: any[],
		index: number,
		length: number): void
	{
		updateRange(array, null, index, length);
	}

	export function register<T>(array: T[], item: T): boolean
	{
		if(!array)
			throw new Error("ArgumentNullException: 'array' cannot be null.");
		var len = array.length; // avoid querying .length more than once. *
		var ok = !len || !contains(array, item);
		if (ok) array[len] = item; // * push would query length again.
		return ok;
	}

	export function findIndex<T>(array: IArray<T>, predicate: (item: T) => boolean): number
	{
		if(!array)
			throw new Error("ArgumentNullException: 'array' cannot be null.");
		if (!Types.isFunction(predicate))
			throw new Error("InvalidArgumentException: 'predicate' must be a function.");
		var len = array.length | 0;
		for (var i = 0 | 0; i < len; ++i)
			if (i in array && predicate(array[i]))
				return i;

		return -1;

	}

	export function areAllEqual(arrays: any[][], strict?: boolean): boolean
	{
		if(!arrays)
			throw new Error("ArgumentNullException: 'arrays' cannot be null.");
		if (arrays.length < 2)
			throw new Error("Cannot compare a set of arrays less than 2.");
		var first = arrays[0];
		for (var i = 0 | 0, l = arrays.length | 0; i < l; ++i)
		{
			if (!areEqual(first, arrays[i], strict))
				return false;
		}
		return true;
	}

	export function areEqual<T>(
		a: IArray<T>, b: IArray<T>,
		strict?: boolean,
		equalityComparer: (a: T, b: T, strict?: boolean) => boolean = System.areEqual)
		: boolean
	{
		if (a === b)
			return true;

		var len = a.length | 0;
		if (len != (b.length | 0))
			return false;

		for (var i = 0 | 0; i < len; ++i)
			if (!equalityComparer(a[i], b[i], strict))
				return false;

		return true;

	}


	export function applyTo<T extends IArray<number>>(target: T, fn: (a: number) => number): T
	{
		if(!target)
			throw new Error("ArgumentNullException: 'target' cannot be null.");

		if(fn)
		{
			for(var i = 0 | 0; i<target.length; ++i)
				target[i] = fn(target[i]);
		}
		return target;
	}

	export function removeIndex<T>(array: T[], index: number): boolean
	{
		if(!array)
			throw new Error("ArgumentNullException: 'array' cannot be null.");

		var exists = index < array.length;
		if (exists)
			array.splice(index, 1);
		return exists;
	}

	export function remove<T>(array: T[], value: T, max?: number): number
	{
		if(!array)
			throw new Error("ArgumentNullException: 'array' cannot be null.");

		var count = 0;
		if (array && array.length && max !== 0)
		{
			if (!max)
				max = Infinity;

			for (var i = (array.length - 1) | 0; i >= 0; --i) if (array[i] === value)
			{
				array.splice(i, 1);
				++count;
				if (!--max)
					break;
			}
		}

		return count;
	}

	export function repeat<T>(element: T, count: number): T[]
	{
		var result: T[] = [];
		while (count--)
			result.push(element);

		return result;
	}


	export function sum(source: number[], ignoreNaN:boolean = false): number
	{
		if (!source || !source.length)
			return 0;

		var result = 0;
		if (ignoreNaN)
			source.forEach(n =>
			{
				if (!isNaN(n)) result += n;
			});
		else
			source.every(n =>
			{
				result += n;
				return !isNaN(result);
			});

		return result;
	}

	export function average(source: number[], ignoreNaN: boolean = false): number
	{
		if (!source || !source.length)
			return NaN;

		var result = 0, count:number;
		if (ignoreNaN)
		{
			count = 0;
			source.forEach(n =>
			{
				if (!isNaN(n))
				{
					result += n;
					count++;
				}
			});

		}
		else
		{
			count = source.length;
			source.every(n =>
			{
				result += n;
				return !isNaN(result);
			});

		}

		return (!count || isNaN(result)) ? NaN : (result / count);
	}

	export function product(source: number[], ignoreNaN: boolean = false): number
	{
		if (!source || !source.length)
			return NaN;

		var result = 1;
		if (ignoreNaN)
		{
			var found = false;
			source.forEach(n =>
			{
				if (!isNaN(n))
				{
					result *= n;
					if (!found) found = true;
				}
			});

			if (!found)
				result = NaN;
		}
		else
		{
			source.every(n =>
			{
				if (isNaN(n))
				{
					result = NaN;
					return false;
				}

				result *= n;

				return true;
			});
		}

		return result;
	}

	function ifSet(source: number[], start: number, ignoreNaN: boolean, predicate: (n: number, result:number) => boolean)
	{
		if (!source || !source.length)
			return NaN;

		var result = start;
		if (ignoreNaN)
		{
			var found = false;
			source.forEach(n =>
			{
				if (!isNaN(n))
				{
					if(predicate(n,result))
						result = n;
					if (!found) found = true;
				}
			});

			if (!found)
				result = NaN;
		}
		else
		{
			source.every(n =>
			{
				if (isNaN(n))
				{
					result = NaN;
					return false;
				}

				if (predicate(n, result))
					result = n;

				return true;
			});
		}
		return result;

	}

	export function min(source: number[], ignoreNaN: boolean = false): number
	{
		return ifSet(source, +Infinity, ignoreNaN, (n, result) => n < result);
	}

	export function max(source: number[], ignoreNaN: boolean = false): number
	{
		return ifSet(source, -Infinity, ignoreNaN, (n, result) => n > result);
	}

}