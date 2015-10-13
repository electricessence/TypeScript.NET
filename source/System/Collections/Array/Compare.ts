/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IArray.d.ts"/>
///<reference path="../../FunctionTypes.d.ts"/>
import * as Values from '../../Compare';
import Types from '../../Types';

/*  validateSize: Utility for quick validation/invalidation of array equality.
	Why this way?  Why not pass a closure for the last return?
	Reason: Performance and avoiding the creation of new functions/closures. */
function validateSize(a:IArray<any>, b:IArray<any>):any
{
	// Both valid and are same object, or both are null/undefined.
	if(a && b && a===b || !a && !b)
		return true;

	// At this point, at least one has to be non-null.
	if(!a || !b)
		return false;

	var len = a.length | 0;
	if(len!==(b.length | 0))
		return false;

	// If both are arrays and have zero length, they are equal.
	if(len===0)
		return true;

	// Return the length for downstream processing.
	return len;
}

export function areAllEqual(
	arrays:any[][],
	strict?:boolean,
	equalityComparer:EqualityComparison<any> = Values.areEqual):boolean
{
	if(!arrays)
		throw new Error("ArgumentNullException: 'arrays' cannot be null.");
	if(arrays.length<2)
		throw new Error("Cannot compare a set of arrays less than 2.");
	var first = arrays[0];
	for(let i = 0 | 0, l = arrays.length | 0; i<l; ++i)
	{
		if(!areEqual(first, arrays[i], strict, equalityComparer))
			return false;
	}
	return true;
}

export function areEqual<T>(
	a:IArray<T>, b:IArray<T>,
	strict?:boolean,
	equalityComparer:EqualityComparison<T> = Values.areEqual):boolean
{
	var len = validateSize(a, b);
	if(Types.isBoolean(len)) return <boolean>len;

	for(let i = 0 | 0; i<len; ++i)
	{
		if(!equalityComparer(a[i], b[i], strict))
			return false;
	}

	return true;

}

function copyAndSort<T>(a:IArray<T>, comparer:Comparison<T>):T[]
{
	if(!a) return null;
	if(a instanceof Array) return (<Array<T>>a).slice();
	var len = a.length, b:T[];
	if(len>65536) b = new Array(len);
	else
	{
		b = [];
		b.length = len;
	}
	for(let i = 0; i<len; i++) b[i] = a[i];
	b.sort(comparer);
	return b;
}

export function areEquivalent<T>(
	a:IArray<T>, b:IArray<T>,
	comparer:Comparison<T> = Values.compare):boolean
{
	var len = validateSize(a, b);
	if(Types.isBoolean(len)) return <boolean>len;

	// There might be a better more performant way to do this, but for the moment, this
	// works quite well.
	a = copyAndSort(a, comparer);
	b = copyAndSort(b, comparer);

	for(let i = 0 | 0; i<len; ++i)
	{
		if(comparer(a[i], b[i])!==0)
			return false;
	}

	return true;

}
