/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import Types = require('../Types');

function clone(source:any, depth:number = 0):any
{
	if(depth<0)
		return source;

	switch(typeof source)
	{
		case Types.UNDEFINED:
		case Types.NULL:
		case Types.STRING:
		case Types.BOOLEAN:
		case Types.NUMBER:
		case Types.FUNCTION:
			return source; // return primitives as is.
	}

	var result:any;
	if(source instanceof Array)
	{
		result = (<any>source).slice();
		if(depth>0)
		{
			for(var i = 0; i<result.length; i++)
			{
				result[i] = clone(result[i], depth - 1);
			}
		}
	}
	else
	{
		result = {};
		if(depth>0) for(var k in source)
		{
			//noinspection JSUnfilteredForInLoop
			result[k] = clone(source[k], depth - 1);
		}
	}

	return result;

}

export = clone;
