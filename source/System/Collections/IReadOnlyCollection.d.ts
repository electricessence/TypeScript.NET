/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {ArrayLikeWritable} from "./Array/ArrayLikeWritable";
import {FiniteIEnumerable} from "./Enumeration/IEnumerable";

export interface IReadOnlyCollection<T>
extends FiniteIEnumerable<T>
{
	count:number;
	isReadOnly:boolean;

	contains(entry:T):boolean;
	copyTo<TTarget extends ArrayLikeWritable<any>>(target:TTarget, index?:number):TTarget;
	toArray():T[];
}

export default IReadOnlyCollection;