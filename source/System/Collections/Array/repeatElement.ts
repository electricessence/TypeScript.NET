/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import Integer from "../../Integer";
import init from "./initializeArray";

const COUNT = 'count';

/**
 * Simply repeats a value the number of times specified.
 * @param element
 * @param count
 * @returns {T[]}
 */
export function repeatElement<T>(element:T, count:number):T[]
{
	Integer.assertPositive(count, COUNT);
	const result = init<T>(count);
	for(let i = 0; i<count; i++)
		result[i] = element;
	return result;
}

