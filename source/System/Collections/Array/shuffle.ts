/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import ArrayLikeWritable from "./ArrayLikeWritable";

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
export function shuffle<T extends ArrayLikeWritable<any>>(target:T):T
{
	let i = target.length;
	while(--i)
	{
		const j = Math.floor(Math.random()*(i + 1));
		const temp = target[i];
		target[i] = target[j];
		target[j] = temp;
	}
	return target;
}

