/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import Type from './Types';
import isTrueNaN = Type.isTrueNaN;

export const enum CompareResult {
	Equal   = 0,
	Greater = 1,
	Less    = -1
}


// Used for special equals cases like NaN.
export function areEqual(a:any, b:any, strict:boolean = true):boolean
{
	return a===b || !strict && a==b || isTrueNaN(a) && isTrueNaN(b);
}

export function compare(a:any, b:any, strict:boolean = true):CompareResult
{

	if(areEqual(a, b, strict))
		return CompareResult.Equal;

	// Allow for special inequality..

	if(a>b || strict && (a===0 && b==0 || a===null && b===undefined))
		return CompareResult.Greater;

	if(b>a || strict && (b===0 && a==0 || b===null && a===undefined))
		return CompareResult.Less;

	return NaN;
}
