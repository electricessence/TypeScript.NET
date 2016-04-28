/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../../Disposable/IDisposable.d.ts"/>
///<reference path="IEnumerable.d.ts"/>
///<reference path="IEnumerator.d.ts"/>
///<reference path="IYield.d.ts"/>
///<reference path="../IEnumerableOrArray.d.ts"/>
///<reference path="IIterator.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import {using} from "../../Disposable/dispose";
import Type from "../../Types";
import ArrayEnumerator from "./ArrayEnumerator";
import IndexEnumerator from "./IndexEnumerator";
import UnsupportedEnumerableException from "./UnsupportedEnumerableException";

const
	VOID0:any = void(0),
	STRING_EMPTY:string = "",
	ENDLESS_EXCEPTION_MESSAGE =
		'Cannot call forEach on an endless enumerable. '+
		'Would result in an infinite loop that could hang the current process.';

export function throwIfEndless(isEndless:boolean):void {
	if(isEndless) throw new UnsupportedEnumerableException(ENDLESS_EXCEPTION_MESSAGE);
}

function initArrayFrom(source:IEnumerableOrArray<any>|IEnumerator<any>):any[] {
	if(Array.isArray(source) || Type.isString(source)) {
		var len = source.length;
		if(isFinite(len))
		{
			if(len>65535) return new Array(len);
			var result:any[] = [];
			result.length = len;
			return result;
		}
	}
	return [];
}

class EmptyEnumerator implements IEnumerator<any>
{
	get current():any
	{
		return VOID0;
	}

	moveNext():boolean
	{
		return false;
	}

	nextValue():any
	{
		return VOID0;
	}

	next():IIteratorResult<any>
	{
		return {
			value: VOID0,
			done: true
		}
	}

	reset():void { }

	dispose():void { }

	get isEndless():boolean {
		return false;
	}
}

const Empty = new EmptyEnumerator();
Object.freeze(Empty);

export const empty:IEnumerator<any> = Empty;

// Could be array, or IEnumerable...
export function from<T>(source:IEnumerableOrArray<T>):IEnumerator<T>
{
	// To simplify and prevent null reference exceptions:
	if(!source)
		return Empty;

	if(Array.isArray(source))
		return new ArrayEnumerator<T>(<T[]>source);

	if(Type.isArrayLike<T>(source))
	{
		return new IndexEnumerator<T>(
			() =>
			{
				return {
					source: source,
					length: source.length,
					pointer: 0,
					step: 1
				}
			}
		);
	}

	if(!Type.isPrimitive(source))
	{
		if(isEnumerable<T>(source))
			return source.getEnumerator();

	}

	throw new Error("Unknown enumerable.");
}

export function isEnumerable<T>(instance:any):instance is IEnumerable<T>
{
	return Type.hasMemberOfType<IEnumerable<T>>(instance, "getEnumerator", Type.FUNCTION);
}

export function isEnumerableOrArrayLike<T>(instance:any):instance is IEnumerableOrArray<T>
{
	return Type.isArrayLike(instance) || isEnumerable(instance);
}


export function isEnumerator<T>(instance:any):instance is IEnumerator<T>
{
	return Type.hasMemberOfType<IEnumerator<T>>(instance, "moveNext", Type.FUNCTION);
}

/**
 * Flexible method for iterating any enumerable, enumerable, array, or array-like object.
 * @param e
 * @param action
 * @returns true if enumerated, false if null or unrecognized enumerable, void if nothing done
 */
export function forEach<T>(
	e:IEnumerableOrArray<T>|IEnumerator<T>,
	action:(element:T, index?:number) => any):boolean|void
{
	if(e!==VOID0 && e!==null) // Allow for empty string.
	{
		if(Type.isArrayLike<T>(e))
		{
			// Assume e.length is constant or at least doesn't deviate to infinite or NaN.
			throwIfEndless(!isFinite(e.length));

			for(let i = 0; i<e.length; i++)
			{
				if(action(e[i], i)===false)
					break;
			}
			return true;
		}

		if(isEnumerator<T>(e))
		{
			throwIfEndless(e.isEndless);

			var index = 0;
			// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
			while(e.moveNext())
			{
				if(action(e.current, index++)===false)
					break;
			}
			return true;
		}

		if(isEnumerable<T>(e))
		{
			// For enumerators that aren't EnumerableBase, ensure dispose is called.
			using(
				(<IEnumerable<T>>e).getEnumerator(),
				f=>forEach(f, action)
			);
			return true;
		}

		return false;
	}
}

/**
 * Converts any enumerable to an array.
 * @param source
 * @returns {any}
 */
export function toArray<T>(
	source:IEnumerableOrArray<T>|IEnumerator<T>):T[]
{
	if(<any>source===STRING_EMPTY) return [];

	if(Array.isArray(source))
		return source.slice();

	var result:T[] = initArrayFrom(source);
	if(!forEach(source,(e, i) => { result[i] = e; }))
		throw new UnsupportedEnumerableException();

	return result;
}

/**
 * Converts any enumerable to an array of selected values.
 * @param source
 * @param selector
 * @returns {TResult[]}
 */
export function map<T,TResult>(
	source:IEnumerableOrArray<T>|IEnumerator<T>,
	selector:Selector<T,TResult>):TResult[]
{
	var result:TResult[] = initArrayFrom(source);
	if(!forEach(source,(e, i) => { result[i] = selector(e); }))
		throw new UnsupportedEnumerableException();

	return result;
}