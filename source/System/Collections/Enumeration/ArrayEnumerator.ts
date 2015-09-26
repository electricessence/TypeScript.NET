/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

///<reference path="../Array/IArray.ts"/>
import IndexEnumerator= require('./IndexEnumerator');
import Types = require('../../Types');

class ArrayEnumerator<T> extends IndexEnumerator<T>
{
	constructor(arrayFactory:() => IArray<T>, start?:number, step?:number);
	constructor(array:IArray<T>, start?:number, step?:number);
	constructor(arrayOrFactory:any, start:number = 0, step:number = 1)
	{
		super(
			() =>
			{
				var array = Types.isFunction(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
				return {source: array, pointer: start, length: (array ? array.length : 0), step: step};
			}
		);
	}
}

export = ArrayEnumerator;
