module System.Collections.ArrayUtility
{

	export function copy<T>(array: T[]): T[] { return array ? array.slice() : array }

	export function contains<T>(array: T[], item: T): boolean { return !array ? false : array.indexOf(item) != -1; }

	export function replace<T>(array: T[], old: T, newValue: T, max?: number): number
	{

		var count = 0;
		if (max !== 0)
		{
			if (!max)
				max = Infinity;

			for (var i = array.length - 1; i >= 0; --i) if (array[i] === old)
			{
				array[i] = newValue;
				++count;
				if (!--max)
					break;
			}
		}

		return count;

	}

	export function register<T>(array: T[], item: T): boolean
	{
		var ok = array && (!array.length || !contains(array, item));
		if (ok) array.push(item);
		return ok;
	}

	export function findIndex<T>(array: T[], predicate: (item: T) => boolean): number
	{

		var len = array.length;
		for (var i = 0; i < len; ++i)
			if (i in array && predicate(array[i]))
				return i;

		return -1;

	}

	export function areAllEqual(arrays: any[][], strict?: boolean): boolean
	{
		if (arrays.length < 2)
			throw new Error("Cannot compare a set of arrays less than 2.");
		var first = arrays[0];
		for (var i = 0, l = arrays.length; i < l; ++i)
		{
			if (!areEqual(first, arrays[i], strict))
				return false;
		}
		return true;
	}

	export function areEqual(a: any[], b: any[], strict?: boolean): boolean
	{

		if (a === b)
			return true;

		var len = a.length;
		if (len != b.length)
			return false;

		var equal: (a: any, b: any, strict?: boolean) => boolean = System.areEqual;

		for (var i = 0; i < len; ++i)
			if (!equal(a[i], b[i], strict))
				return false;

		return true;

	}


	export function applyTo(target: number[], fn: (a: number) => number): number[]
	{
		for (var i = 0; i < target.length; ++i)
			target[i] = fn(target[i]);
		return target;
	}

	export function removeIndex<T>(array: T[], index: number): boolean
	{
		var exists = index < array.length;
		if (exists)
			array.splice(index, 1);
		return exists;
	}

	export function remove<T>(array: T[], value: T, max?: number): number
	{
		var count = 0;
		if (array && array.length && max !== 0)
		{
			if (!max)
				max = Infinity;

			for (var i = array.length - 1; i >= 0; --i) if (array[i] === value)
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
		if (!source.length)
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
		if (!source.length)
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
		if (!source.length)
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
		if (!source.length)
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