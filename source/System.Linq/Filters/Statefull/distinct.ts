/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {EqualityComparison, HashSelector} from "../../../System/FunctionTypes";
import {IEnumerableFilter} from "../../ILinq/ILinqFilter";
import HashSet from "../../../System/Collections/HashSet";
import {areEqual} from "../../../System/Compare";
import FilterFactory from "./FilterFactory";

class DistinctFilter<T> implements IEnumerableFilter<T>
{
	constructor(
		hashGenerator?:HashSelector<T>,
		comparer?:EqualityComparison<T>)
	{
		this._registry = new HashSet<T>(hashGenerator, comparer);
	}

	private readonly _registry:HashSet<T>;

	next(e:T):boolean | null
	{
		return this._registry.addMissing(e);
	}

	reset()
	{
		this._registry.clear();
	}
}

export default function <T>(
	hashGenerator?:HashSelector<T>,
	comparer:EqualityComparison<T> = areEqual)
	:FilterFactory<T>
{
	return new FilterFactory<T>(
		()=> new DistinctFilter<T>(hashGenerator, comparer)
	);
}