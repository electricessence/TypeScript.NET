/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import IDisposable from "../../System/Disposable/IDisposable";
import {Predicate} from "../../System/FunctionTypes";

export interface IEnumerableFilter<T> extends IDisposable
{
	// Returning null (or anything other than true or false) is the same as 'break'.
	allowNext(e:T):boolean | null
}

declare type ILinqFilter<T> = IEnumerableFilter<T> | Predicate<T>;

export default ILinqFilter;