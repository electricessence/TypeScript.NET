/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */



import IMap from "../../IMap";
import applyEntries from "./applyEntries";
import copyEntries from "./copyEntries";

/**
 * Takes two objects and creates another with the values of both.
 * B overwrites A.
 * @param a
 * @param b
 */
export function mergeEntries<A extends IMap<any>, B extends IMap<any>>(
	a:A,
	b:B):A & B
{
	return applyEntries(copyEntries(a), b);
}
