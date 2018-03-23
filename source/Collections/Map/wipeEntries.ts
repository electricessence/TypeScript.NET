/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import IMap from "../../IMap";

export function wipeEntries(map:IMap<any>, depth:number = 1):void
{
	if(map && depth)
	{
		for(let key of Object.keys(map))
		{
			const v = map[key];
			delete map[key];
			wipeEntries(v, depth - 1);
		}
	}
}