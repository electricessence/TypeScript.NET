/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

import Types = require('./Types');

module System
{

	const
	INT_ZERO:number = 0 | 0,
	INT_POS1:number = (+1) | 0,
	INT_NEG1:number = (-1) | 0;


	export function isEqualToNaN(n:any):boolean
	{
		return typeof n===Types.Number && isNaN(n);
	}

	// Used for special equals cases like NaN.
	export function areEqual(a:any, b:any, strict:boolean = true):boolean
	{
		return a===b || !strict && a==b || isEqualToNaN(a) && isEqualToNaN(b);
	}

	export function compare(a:any, b:any, strict:boolean = true):number
	{

		if(areEqual(a, b, strict))
			return INT_ZERO;

		// Allow for special inequality..

		if(a>b || strict && (a===0 && b==0 || a===null && b===undefined))
			return INT_POS1;

		if(b>a || strict && (b===0 && a==0 || b===null && a===undefined))
			return INT_NEG1;

		return NaN;
	}


	export function clone(source:any, depth:number = 0):any
	{
		if(depth<0)
			return source;

		switch(typeof source)
		{
			case Types.Undefined:
			case Types.Null:
			case Types.String:
			case Types.Boolean:
			case Types.Number:
			case Types.Function:
				return source;// return primitives as is.
		}

		var result:any;
		if(source instanceof Array)
		{
			result = (<any>source).slice();
			if(depth>0)
			{
				for(var i = 0; i<result.length; i++)
				{
					if(i in result)
						result[i] = clone(result[i], depth - 1);
				}
			}
		}
		else {
			result = {};
			if(depth>0) for(var k in source)
			{
				//noinspection JSUnfilteredForInLoop
				result[k] = clone(source[k], depth - 1);
			}
		}

		return result;

	}

	export function copyTo(source:any, target:any):void
	{
		for(var k in source)
		{
			//noinspection JSUnfilteredForInLoop
			target[k] = source[k];
		}
	}

	export function applyMixins(derivedConstructor:any, baseConstructors:any[]):void
	{
		baseConstructors.forEach(
				bc =>
			{
				Object.getOwnPropertyNames(bc.prototype).forEach(
						name =>
					{
						derivedConstructor.prototype[name] = bc.prototype[name];
					}
				);
			}
		);
	}
}

export = System;
