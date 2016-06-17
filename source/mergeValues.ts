/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

/**
 * Takes a target object and ensures values exist.
 * @param target
 * @param defaults
 * @returns {any}
 */
export default
function mergeValues<T extends Object, U extends Object>(
	target:T,
	defaults:U):T & U
{
	const result:any = target || {};
	for(const key in defaults)
	{
		if(defaults.hasOwnProperty(key) && !result.hasOwnProperty(key))
		{
			result[key] = (<any>defaults)[key];
		}
	}
	return result;
}

