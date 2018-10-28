/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IEnumerator, EndlessIEnumerator, FiniteIEnumerator} from "./IEnumerator";

export interface IEnumerable<T>
{
	getEnumerator():IEnumerator<T>;

	/**
	 * Provides a way of flagging endless enumerations that may cause issues.
	 */
	readonly isEndless?:boolean;
}

export interface EndlessIEnumerable<T> extends IEnumerable<T>
{
	getEnumerator():EndlessIEnumerator<T>;

	readonly isEndless:true;
}

export interface FiniteIEnumerable<T> extends IEnumerable<T>
{
	getEnumerator():FiniteIEnumerator<T>;

	readonly isEndless:false;
}

export default IEnumerable;