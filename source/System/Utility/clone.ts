/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Type} from "../Types";
import {Primitive} from "../Primitive";
import {JsonArray, JsonMap} from "../../JSON";
import {copy} from "../Collections/Array/copy";

export default function clone(source:Primitive | JsonMap | JsonArray, depth:number = 0):any
{
	if(depth<0)
		return source;

	// return primitives as is.
	if(!Type.isObject(source))
		return source;

	if(Type.isArrayLike(source))
	{
		// Make a copy first just in case there's some weird references.
		const result = copy(source);
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
