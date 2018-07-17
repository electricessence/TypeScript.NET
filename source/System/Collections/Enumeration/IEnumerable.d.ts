/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IEnumerator} from "./IEnumerator";

export interface IEnumerable<T>
{
	getEnumerator():IEnumerator<T>;

	/**
	 * Provides a way of flagging endless enumerations that may cause issues.
	 */
	readonly isEndless?:boolean;
}

export interface IEndlessEnumerable<T> extends IEnumerable<T>
{
	readonly isEndless:true;
}

export interface IFiniteEnumerable<T> extends IEnumerable<T>
{
	readonly isEndless:false;
}

export default IEnumerable;