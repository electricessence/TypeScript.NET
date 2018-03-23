/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import Primitive from "../../Primitive";
import IComparable from "../../IComparable";
import {Comparison} from "../../FunctionTypes";
import compare from "../../Comparison/compare";
import validateSize from "./validateSize";
import copyArray from "./copyArray";

function internalSort<T>(a:ArrayLike<T>, comparer:Comparison<T>):ArrayLike<T>
{
	if(!a || a.length<2) return a;
	const b = copyArray(a);
	return b.sort(comparer);
}

/**
 * Returns true if both arrays contain the same set of values.
 * @param {ArrayLike} a
 * @param {ArrayLike} b
 * @returns {boolean}
 */
export default function areArraysEquivalent<T extends Primitive>(a:ArrayLike<T>, b:ArrayLike<T>):boolean;
export default function areArraysEquivalent<T>(a:ArrayLike<IComparable<T>>, b:ArrayLike<IComparable<T>>):boolean;
export default function areArraysEquivalent<T>(a:ArrayLike<T>, b:ArrayLike<T>, comparer:Comparison<T>):boolean;
export default function areArraysEquivalent<T>(
	a:ArrayLike<T>, b:ArrayLike<T>,
	comparer:Comparison<T> = compare):boolean
{
	const len = validateSize(a, b);
	if(typeof len=='boolean') return len;

	// There might be a better more performant way to do this, but for the moment, this
	// works quite well.
	a = internalSort(a, comparer);
	b = internalSort(b, comparer);

	for(let i = 0; i<len; i++)
	{
		if(comparer(a[i], b[i])!==0)
			return false;
	}

	return true;
}
