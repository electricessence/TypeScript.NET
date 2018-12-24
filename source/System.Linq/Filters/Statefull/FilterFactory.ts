/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Func} from "../../../System/FunctionTypes";
import {IEnumerableFilter} from "../../ILinq/ILinqFilter";

// Provide a class to be able to differentiate between simple filter functions.
export default class FilterFactory<T>
{
	constructor(private readonly _factory:Func<IEnumerableFilter<T>>)
	{}

	create():IEnumerableFilter<T>{
		return this._factory();
	}
}