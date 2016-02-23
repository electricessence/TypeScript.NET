/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict'; // For compatibility with (let, const, function, class);

///<reference path="../../Disposable/IDisposable.d.ts"/>
///<reference path="IEnumerable.d.ts"/>
///<reference path="IEnumerator.d.ts"/>
///<reference path="IYield.d.ts"/>
import Type from '../../Types';
import DisposableBase from '../../Disposable/DisposableBase';
import ArrayEnumerator from './ArrayEnumerator';
import IndexEnumerator from './IndexEnumerator';


class EmptyEnumerator implements IEnumerator<any>
{
	get current():any
	{
		return undefined;
	}

	moveNext():boolean
	{
		return false;
	}

	reset():void { }

	dispose():void { }
}

const Empty = new EmptyEnumerator();

// Could be array, or IEnumerable...
export function from<T>(source:IEnumerable<T> | IArray<T>):IEnumerator<T>
{
	// To simplify and prevent null reference exceptions:
	if(!source)
		return Empty;

	if(Array.isArray(source))
		return new ArrayEnumerator<T>(<T[]>source);


	if(!Type.isPrimitive(source))
	{
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
		if(isEnumerable<T>(source))
			return source.getEnumerator();

	}

	throw new Error("Unknown enumerable.");
}

export function isEnumerable<T>(instance:any):instance is IEnumerable<T>
{
	return Type.hasMemberOfType<IEnumerable<T>>(instance, "getEnumerator", Type.FUNCTION);
}

export function forEach<T>(
	e:IEnumerator<T>,
	action:(element:T, index?:number) => any):void
{
	if(e)
	{
		var index = 0;
		// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
		while(e.moveNext())
		{
			if(action(e.current, index++)===false)
				break;
		}
	}
}
