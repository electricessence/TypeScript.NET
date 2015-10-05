/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../../Disposable/IDisposable.d.ts"/>
///<reference path="IEnumerable.d.ts"/>
///<reference path="IEnumerator.d.ts"/>
///<reference path="IYield.d.ts"/>
import Types = require('../../Types');
import DisposableBase = require('../../Disposable/DisposableBase');
import ArrayEnumerator= require('./ArrayEnumerator');
import IndexEnumerator= require('./IndexEnumerator');


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

	if(source instanceof Array)
		return new ArrayEnumerator<T>(<T[]>source);

	if(typeof source===Types.OBJECT)
	{
		if("length" in source)
		{
			var a = <IArray<T>>source;
			return new IndexEnumerator<T>(
				() =>
				{
					return {
						source: <{[index: number]: T}>a,
						length: a.length,
						pointer: 0,
						step: 1
					}
				}
			);
		}
		if("getEnumerator" in source)
			return (<any>source).getEnumerator();

	}

	throw new Error("Unknown enumerable.");
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
