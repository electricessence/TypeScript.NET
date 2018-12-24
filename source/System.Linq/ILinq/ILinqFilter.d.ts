/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Predicate} from "../../System/FunctionTypes";

export interface IEnumerableFilter<T>
{
	// Returning null (or anything other than true or false) is the same as 'break'.
	next(e:T):boolean | null
}

export interface IResettableLinqFilter<T>
	extends IEnumerableFilter<T>
{
	reset():void;
}

declare type ILinqFilter<T> = IEnumerableFilter<T> | IResettableLinqFilter<T> | Predicate<T>;

export default ILinqFilter;