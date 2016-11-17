/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export interface Awaiter
{
	(thisArg:any, _arguments:any[], P:PromiseConstructorLike, generator:Function):void;
}

export function awaiter(
	thisArg:any,
	_arguments:any[],
	P:PromiseConstructorLike,
	generator:Function)
{
	if(!P) throw "Must provide Promise constructor.  Try injecting Promise using awaiter.factory(PromiseConstructorLike).";
	return new P((resolve, reject) =>
	{
		const g = generator = generator.apply(thisArg, _arguments);
		step(g.next());

		function fulfilled(value:any)
		{
			try
			{ step(g.next(value)); }
			catch(e)
			{ reject(e); }
		}

		function rejected(value:any)
		{
			try
			{ step(g["throw"](value)); }
			catch(e)
			{ reject(e); }
		}

		function step(result:any)
		{
			result.done
				? resolve(result.value)
				: new P(resolve => { resolve(result.value); }).then(fulfilled, rejected);
		}
	});
}

export module awaiter
{
	export function factory(Promise:PromiseConstructorLike):Awaiter
	{
		return (thisArg:any, _arguments:any[], P:PromiseConstructorLike, generator:Function) =>
		{
			awaiter(thisArg, _arguments, P || Promise, generator);
		};
	}
}
