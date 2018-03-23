/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {JsonEntry} from "../JSON";
import isObject from "../Reflection/isObject";
import copyArray from "../Collections/Array/copyArray";
import isArrayLike from "../Reflection/isArrayLike";

export default function clone(source:JsonEntry, depth:number = 0):any
{
	if(depth<0 || !source || !isObject(source))
		return source;

	if(isArrayLike(source))
	{
		// Make a copyArray first just in case there's some weird references.
		const result = copyArray(source);
		if(depth>0)
		{
			const len = source.length;
			for(let i = 0; i<len; i++)
			{
				result[i] = clone(result[i], depth - 1);
			}
		}
		return result;
	}
	else
	{
		const result:any = {};
		if(depth>0) for(let k in <any>source)
		{
			//noinspection JSUnfilteredForInLoop
			result[k] = clone((<any>source)[k], depth - 1);
		}
		return result;
	}


}
