/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {EqualityComparison} from "../../FunctionTypes";
import areEqual from "../../Comparison/areEqual";
import indexOfElement from "./indexOfElement";

/**
 * Checks to see if the provided array contains an item.
 * If the array value is null, then false is returned.
 * @param array
 * @param item
 * @param {function?} equalityComparer
 * @returns {boolean}
 */
export default function containsElement<T>(
	array:ArrayLike<T>, item:T,
	equalityComparer:EqualityComparison<T> = areEqual):boolean
{
	return indexOfElement(array, item, equalityComparer)!= -1;
}
