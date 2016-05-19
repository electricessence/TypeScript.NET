/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {Type} from "./Types";
import {Primitive} from "./Primitive";
import {IComparable} from "./IComparable";
import {CompareResult} from "./CompareResult";
import isTrueNaN = Type.isTrueNaN;

const VOID0:any = void 0;

/**
 * Used for special comparison including NaN.
 * @param a
 * @param b
 * @param strict
 * @returns {boolean|any}
 */
export function areEqual(a:any, b:any, strict:boolean = true):boolean
{
	return a===b
		|| !strict && a==b
		|| isTrueNaN(a) && isTrueNaN(b);
}

const COMPARE_TO = "compareTo";

/**
 * Compares two comparable objects or primitives.
 * @param a
 * @param b
 */
export function compare<T>(a:IComparable<T>, b:IComparable<T>):number;
export function compare<T extends Primitive>(a:T, b:T, strict?:boolean):CompareResult;
export function compare(a:any, b:any, strict:boolean = true):CompareResult
{

	if(areEqual(a, b, strict))
		return CompareResult.Equal;

	if(a && Type.hasMember(a, COMPARE_TO))
		return a.compareTo(b); // If a has compareTo, use it.
	else if(b && Type.hasMember(b, COMPARE_TO))
		return -b.compareTo(a); // a doesn't have compareTo? check if b does and invert.

	// Allow for special inequality..

	if(a>b || strict && (a===0 && b==0 || a===null && b===VOID0))
		return CompareResult.Greater;

	if(b>a || strict && (b===0 && a==0 || b===null && a===VOID0))
		return CompareResult.Less;

	return NaN;
}

/**
 * Determines if two primitives are equal or if two objects have the same key/value combinations.
 * @param a
 * @param b
 * @param nullEquivalency If true, null/undefined will be equivalent to an empty object {}.
 * @param extraDepth
 * @returns {boolean}
 */
export function areEquivalent(a:any, b:any, nullEquivalency:boolean = true, extraDepth:number = 0):boolean
{

	// Take a step by step approach to ensure efficiency.
	if(areEqual(a, b, true)) return true;

	if(a===null || a===VOID0 || b==null || b===VOID0)
	{
		if(!nullEquivalency) return false;

		if(Type.isObject(a))
		{
			return !Object.keys(a).length;
		}

		if(Type.isObject(b))
		{
			return !Object.keys(b).length;
		}

		return (a===null || a===VOID0) && (b==null || b===VOID0);
	}

	if(Type.isObject(a) && Type.isObject(b))
	{

		var aKeys = Object.keys(a), bKeys = Object.keys(b), len = aKeys.length;
		if(len!=bKeys.length)
			return false;

		aKeys.sort();
		bKeys.sort();

		for(let i = 0; i<len; i++)
		{
			let key = aKeys[i];
			if(key!==bKeys[i] || !areEqual(a[key], b[key], true)) return false;
		}

		// Doesn't track circular references but allows for controlling the amount of recursion.
		if(extraDepth>0) {

			for(let key of aKeys) {
				if(!areEquivalent(a[key], b[key], nullEquivalency, extraDepth-1)) return false;
			}
		}

		return true;
	}

	return false;
}
