/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import Primitive from "../Primitive";
import IComparable from "./IComparable";
import CompareResult from "./CompareResult";
import hasMember from "../Reflection/hasMember";
import areEqual from "./areEqual";

const VOID0:undefined = void 0;
const COMPARE_TO = "compareTo";

/**
 * Compares two comparable objects or primitives.
 * @param a
 * @param b
 */
export default function compare<T>(a:IComparable<T>, b:IComparable<T>):number;
export default function compare<T extends Primitive>(a:T, b:T, strict?:boolean):CompareResult;
export default function compare(a:any, b:any, strict:boolean = true):CompareResult
{

	if(areEqual(a, b, strict))
		return CompareResult.Equal;

	if(a && hasMember(a, COMPARE_TO))
		return a.compareTo(b); // If a has compareTo, use it.
	else if(b && hasMember(b, COMPARE_TO))
		return -b.compareTo(a); // a doesn't have compareTo? check if b does and invert.

	// Allow for special inequality..

	if(a>b || strict && (a===0 && b==0 || a===null && b===VOID0))
		return CompareResult.Greater;

	if(b>a || strict && (b===0 && a==0 || b===null && a===VOID0))
		return CompareResult.Less;

	return NaN;
}
