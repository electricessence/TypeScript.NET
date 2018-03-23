/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import IMap from "../../IMap";

/**
 * Takes a target object and ensures values exist.
 * @param target
 * @param defaults
 * @returns {any}
 */
export default function ensureEntries<T extends IMap<any>, U extends IMap<any>>(
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