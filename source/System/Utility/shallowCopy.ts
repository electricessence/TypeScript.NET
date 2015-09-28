/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

function shallowCopy(source:any, target:any = {}):any
{
	if(target)
	{
		for(var k in source)
		{
			//noinspection JSUnfilteredForInLoop
			target[k] = source[k];
		}
	}

	return target;
}

export = shallowCopy;
