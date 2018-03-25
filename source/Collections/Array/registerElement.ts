/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import ArrayLikeWritable from "./ArrayLikeWritable";
import {EqualityComparison} from "../../FunctionTypes";
import areEqual from "../../Comparison/areEqual";
import indexOfElement from "./indexOfElement";
import ArgumentNullException from "../../Exceptions/ArgumentNullException";

/**
 * Ensures a value exists within an array.  If not found, adds to the end.
 * @param array
 * @param item
 * @param {function?} equalityComparer
 * @returns {boolean}
 */
export default function registerElement<T>(
	array:ArrayLikeWritable<T>, item:T,
	equalityComparer:EqualityComparison<T> = areEqual):boolean
{
	if(!array)
		throw new ArgumentNullException('array');
	let len = array.length; // avoid querying .length more than once. *
	const ok = !len || indexOfElement(array, item, equalityComparer)==-1;
	if(ok) array[len] = item; // * push would query length again.
	return ok;
}
