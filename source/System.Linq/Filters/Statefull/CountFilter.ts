/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {IEnumerableFilter} from "../../ILinq/ILinqFilter";

/*
	Acts like 'take'.  Can act like skip if during = false and after = true.
 */
export default class CountFilter<T>
	implements IEnumerableFilter<T>
{
	public count:number = 0;

	constructor(
		protected readonly max:number,
		protected readonly during:boolean = true,
		protected readonly after:boolean|null = null)
	{
	}

	next(e:T):boolean | null
	{
		// if Max is NaN then there is no limit as NaN comparisons are always false.  (Will behave like Infinity);
		if(this.count>=this.max) return this.after;
		this.count++;
		return this.during;
	}

	reset():void
	{
		this.count = 0;
	}
}