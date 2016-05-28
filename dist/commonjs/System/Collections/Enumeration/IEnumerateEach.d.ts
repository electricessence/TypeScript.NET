/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Action, Predicate} from "../../FunctionTypes";

export interface IEnumerateEach<T>
{
	// Enforcing an interface that allows operating on a copy can prevent changing underlying data while enumerating.
	forEach(action:Predicate<T> | Action<T>, useCopy?:boolean):number;
}

export default IEnumerateEach;

