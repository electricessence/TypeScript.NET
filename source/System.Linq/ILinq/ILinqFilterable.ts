/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import ILinqSortable from "./ILinqSortable";
import ILinqFilter from "./ILinqFilter";

interface ILinqFilterable<T>
{
	where(...args:ILinqFilter<T>[]):ILinqSortable<T>;
}

/**
 * Conceptually:
 *
 * myEnumerable
 *  .where(
 *      nonNull, // each filter returns a factory for that filter
 *      distinct(...),
 *  )
 *  .orderBy(
 **/