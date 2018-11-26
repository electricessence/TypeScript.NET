/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {ICollection} from "./ICollection";
import FiniteEnumerableOrArrayLike from "./FiniteEnumerableOrArrayLike";

export interface ISet<T> extends ICollection<T>
{

	/**
	 * Attempts to add a new item to the set and returns true if it wasn't there before.
	 * @param item
	 */
	addMissing(item:T):boolean;

	/**
	 * Removes all elements in the specified collection from the current set.
	 */
	exceptWith(
		other:FiniteEnumerableOrArrayLike<T>):void;

	/**
	 * Modifies the current set so that it contains only elements that are also in a specified collection.
	 */
	intersectWith(
		other:FiniteEnumerableOrArrayLike<T>):void;

	/**
	 * Determines whether the current set is a proper (strict) subset of a specified collection.
	 * The other set must have a value that does not exist in the current set.
	 */
	isProperSubsetOf(
		other:FiniteEnumerableOrArrayLike<T>):boolean;

	/**
	 * Determines whether the current set is a proper (strict) superset of a specified collection.
	 * The current set must have a value that does not exist in the other set.
	 */
	isProperSupersetOf(
		other:FiniteEnumerableOrArrayLike<T>):boolean;

	/**
	 * Determines whether a set is a subset of a specified collection.
	 * Equal sets return true.
	 */
	isSubsetOf(
		other:FiniteEnumerableOrArrayLike<T>):boolean;

	/**
	 * Determines whether the current set is a superset of a specified collection.
	 * Equal sets return true.
	 * @param other
	 */
	isSupersetOf(
		other:FiniteEnumerableOrArrayLike<T>):boolean;

	/**
	 * Determines whether the current set overlaps with the specified collection.
	 */
	overlaps(
		other:FiniteEnumerableOrArrayLike<T>):boolean;

	/**
	 * Determines whether the current set and the specified collection contain the same elements.
	 */
	setEquals(
		other:FiniteEnumerableOrArrayLike<T>):boolean;

	/**
	 * Modifies the current set so that it contains only elements that are present either in the current set or in the specified collection, but not both.
	 */
	symmetricExceptWith(
		other:FiniteEnumerableOrArrayLike<T>):void;

	/**
	 * Modifies the current set so that it contains all elements that are present in the current set, in the specified collection, or in both.
	 */
	unionWith(
		other:FiniteEnumerableOrArrayLike<T>):void

}

export default ISet;