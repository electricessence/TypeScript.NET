/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

/**
 * Takes any arrays within an array and inserts the values contained within in place of that array.
 * For every count higher than 0 in recurseDepth it will attempt an additional pass.  Passing Infinity will flatten all arrays contained.
 * @param a
 * @param recurseDepth
 * @returns {any[]}
 */
export default function flatten(a:any[], recurseDepth:number = 0):any[]
{
	const result:any[] = [];
	for(let i = 0; i<a.length; i++)
	{
		let x = a[i];
		if((x) instanceof (Array))
		{
			if(recurseDepth>0) x = flatten(x, recurseDepth - 1);
			for(let n = 0; n<x.length; n++) result.push(x[n]);
		}
		else result.push(x);
	}
	return result;
}
