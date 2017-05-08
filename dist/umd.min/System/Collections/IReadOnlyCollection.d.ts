/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IEnumerable} from "./Enumeration/IEnumerable";
import {ArrayLikeWritable} from "./Array/ArrayLikeWritable";

export interface IReadOnlyCollection<T>
extends IEnumerable<T>
{
	count:number;
	isReadOnly:boolean;

	contains(entry:T):boolean;
	copyTo<TTarget extends ArrayLikeWritable<any>>(target:TTarget, index?:number):TTarget;
	toArray():T[];
}

export default IReadOnlyCollection;