/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {EqualityComparison} from "../../../System/FunctionTypes";
import {IEnumerableFilter} from "../../ILinq/ILinqFilter";
import {areEqual} from "../../../System/Compare";
import FilterFactory from "./FilterFactory";

class DistinctUntilChangedFilter<T>
	implements IEnumerableFilter<T>
{
	constructor(
		private readonly _comparer:EqualityComparison<T> = areEqual)
	{
	}

	private _started:boolean = false;
	private _last:any;

	next(e:T):boolean | null
	{
		const last = this._last;
		this._last = e;
		if(this._started)
		{
			if(this._comparer(last, e, true))
				return false;
		}
		else
		{
			this._started = true;
		}
		return true;
	}

	reset()
	{
		this._started = false;
		this._last = void (0);
	}
}

export default function <T>(
	comparer:EqualityComparison<T> = areEqual)
	:FilterFactory<T> {
	return new FilterFactory<T>(
		() => new DistinctUntilChangedFilter<T>(comparer)
	);
}