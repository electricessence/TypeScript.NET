/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import {PredicateWithIndex} from "../../FunctionTypes";
import isNumber from "../../Reflection/isNumber";
import ArgumentException from "../../Exceptions/ArgumentException";
import ArgumentNullException from "../../Exceptions/ArgumentNullException";

/**
 * Returns the first index of which the provided predicate returns true.
 * Returns -1 if always false.
 * @param array
 * @param predicate
 * @returns {number}
 */
export default function findElementIndex<T>(array:ArrayLike<T>, predicate:PredicateWithIndex<T>):number
{
	if(!array)
		throw new ArgumentNullException('array');
	if(typeof predicate!='function')
		throw new ArgumentException('predicate', 'Must be a function.');

	const len = array.length;
	if(!isNumber(len, true) || len<0)
		throw new ArgumentException('array', 'Does not have a valid length.');

	if((array) instanceof (Array))
	{
		for(let i = 0; i<len; i++)
		{
			if(predicate(array[i], i))
				return i;
		}
	}
	else
	{
		for(let i = 0; i<len; i++)
		{
			if((i) in (array) && predicate(array[i], i))
				return i;
		}
	}


	return -1;
}
