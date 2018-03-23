/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import ArrayLikeWritable from "../Collections/Array/ArrayLikeWritable";
import TypeOfValue from "./TypeOfValue";
import hasMember from "./hasMember";

const LENGTH = "length";

export default function isArrayLike<T>(instance:any):instance is ArrayLikeWritable<T>
{
	const type = typeof instance;
	/*
	 * NOTE:
	 *
	 * Functions:
	 * Enumerating a function although it has a .length property will yield nothing or unexpected results.
	 * Effectively, a function is not like an array.
	 *
	 * Strings:
	 * Behave like arrays but don't have the same exact methods.
	 */
	return instance instanceof Array
		|| type==TypeOfValue.String
		|| type==TypeOfValue.Function && hasMember(instance, LENGTH);
}