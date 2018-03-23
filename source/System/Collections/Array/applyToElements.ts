/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import ArrayLikeWritable from "./ArrayLikeWritable";
import {SelectorWithIndex} from "../../FunctionTypes";

/**
 * Is similar to Array.map() but instead of returning a new array, it updates the existing indexes.
 * Can also be applied to a structure that indexes like an array, but may not be.
 * @param target
 * @param fn
 */
export default function applyToElements<T>(target:ArrayLikeWritable<T>, fn:SelectorWithIndex<T,T>):void
{
	if(target && fn)
	{
		for(let i = 0; i<target.length; i++)
		{
			(<any>target)[i] = fn(target[i], i);
		}
	}
}