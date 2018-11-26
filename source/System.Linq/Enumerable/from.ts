/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {
	EndlessEnumerator,
	InfiniteValueFactory
} from "../../System/Collections/Enumeration/EndlessEnumerator";
import {
	ArrayEnumerable,
	EndlessLinqEnumerable,
	FiniteLinqEnumerable,
	LinqEnumerable
} from "../Linq";
import FiniteEnumerableOrArrayLike from "../../System/Collections/FiniteEnumerableOrArrayLike";
import {Type} from "../../System/Types";
import {
	isEnumerable,
	isEnumerator,
	isIterator
} from "../../System/Collections/Enumeration/Enumerator";
import IteratorEnumerator from "../../System/Collections/Enumeration/IteratorEnumerator";
import {empty} from "../Enumerable";

/**
 * Universal method for converting a primitive enumerables into a LINQ enabled ones.
 *
 * Is not limited to TypeScript usages.
 */
export function from<T>(source:InfiniteValueFactory<T>):EndlessLinqEnumerable<T>
export function from<T>(
	source:FiniteEnumerableOrArrayLike<T>,
	...additional:Array<FiniteEnumerableOrArrayLike<T>>):FiniteLinqEnumerable<T>
export function from<T>(
	source:FiniteEnumerableOrArrayLike<T> | InfiniteValueFactory<T>,
	...additional:Array<FiniteEnumerableOrArrayLike<T>>):EndlessLinqEnumerable<T> | FiniteLinqEnumerable<T>
{
	return enumerableFrom(source, additional);
}

export function fromAny<T>(
	source:InfiniteValueFactory<T>):EndlessLinqEnumerable<T>

export function fromAny<T>(
	source:FiniteEnumerableOrArrayLike<T>):FiniteLinqEnumerable<T>

export function fromAny(
	source:any):LinqEnumerable<any> | undefined

export function fromAny<T>(
	source:FiniteIEnumerable<T>,
	defaultEnumerable:LinqEnumerable<T>):LinqEnumerable<T>

export function fromAny<T>(
	source:any,
	defaultEnumerable?:LinqEnumerable<T>):LinqEnumerable<T> | EndlessLinqEnumerable<T> | undefined
{
	if(Type.isObject(source) || Type.isString(source))
	{
		if(source instanceof EndlessLinqEnumerable)
			return source;

		if(Type.isArrayLike<T>(source))
			return new ArrayEnumerable<T>(source);

		if(isEnumerable<T>(source))
			return new LinqEnumerable<T>(
				() => source.getEnumerator(),
				null, source.isEndless);

		if(isEnumerator<T>(source))
			return new LinqEnumerable<T>(
				() => source, null, source.isEndless);

		if(isIterator<T>(source))
			return fromAny(new IteratorEnumerator(source));
	}
	else if(Type.isFunction(source))
	{
		return new EndlessLinqEnumerable<T>(
			() => new EndlessEnumerator<T>(source));
	}

	return defaultEnumerable;
}

export function fromThese<T>(sources:FiniteEnumerableOrArrayLike<T>[]):FiniteLinqEnumerable<T>
{
	switch(sources ? sources.length : 0)
	{
		case 0:
			return empty<T>();
		case 1:
			// Allow for validation and throwing...
			return enumerableFrom(sources[0]);
		default:
			return empty<T>().merge(sources);
	}
}

export function fromOrEmpty<T>(source:FiniteEnumerableOrArrayLike<T>):LinqEnumerable<T>
{
	return fromAny(source) || empty<T>();
}