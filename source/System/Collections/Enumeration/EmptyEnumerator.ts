/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {IEnumerator} from "./IEnumerator";
import {IteratorResult} from "./IteratorResult";
import {Functions} from "../../Functions";

const VOID0:any = void 0;


/**
 * A simplified stripped down enumerable that is always complete and has no results.
 * Frozen and exported as 'empty' to allow for reuse.
 */

export const EmptyEnumerator:IEnumerator<any> = Object.freeze({
	current: VOID0,
	moveNext: Functions.False,
	nextValue: Functions.Blank,
	next: IteratorResult.GetDone,
	"return": IteratorResult.GetDone,
	reset: Functions.Blank,
	dispose: Functions.Blank,
	isEndless: false
});
export default EmptyEnumerator;