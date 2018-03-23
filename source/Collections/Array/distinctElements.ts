/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

/**
 * Returns a unique reduced set of values.
 * Will produce unexpected results if not uniformly string or number.
 * If a distinct set that contains other than uniformly strings or numbers then use the Set or HashSet classes.
 * @param source
 */
export default function distinctElements(source:string[]|null):string[];
export default function distinctElements(source:number[]|null):number[];
export default function distinctElements(source:any[]|null):any[]
{
	if(!source) return []; // Allowing for null facilitates regex filtering.
	const seen:any = {};
	return source.filter(e => !(e in seen) && (seen[e] = true));
}
