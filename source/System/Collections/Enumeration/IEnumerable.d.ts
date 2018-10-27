/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IEnumerator, EndlessEnumerator, FiniteEnumerator} from "./IEnumerator";

export interface IEnumerable<T>
{
	getEnumerator():IEnumerator<T>;

	/**
	 * Provides a way of flagging endless enumerations that may cause issues.
	 */
	readonly isEndless?:boolean;
}

export interface EndlessEnumerable<T> extends IEnumerable<T>
{
	getEnumerator():EndlessEnumerator<T>;

	readonly isEndless:true;
}

export interface FiniteEnumerable<T> extends IEnumerable<T>
{
	getEnumerator():FiniteEnumerator<T>;

	readonly isEndless:false;
}

export default IEnumerable;