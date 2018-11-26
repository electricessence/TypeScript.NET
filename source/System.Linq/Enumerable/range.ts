/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


// start and step can be other than integer.

import ArgumentOutOfRangeException from "../../System/Exceptions/ArgumentOutOfRangeException";
import Integer from "../../System/Integer";
import {
	EndlessEnumeratorBase,
	FiniteEnumeratorBase
} from "../../System/Collections/Enumeration/EnumeratorBase";
import FiniteLinqEnumerable from "../FiniteLinqEnumerable";
import EndlessLinqEnumerable from "../FiniteLinqEnumerable";
import empty from "./empty";
import {ILinqFinite} from "../ILinq/ILinqFinite";
import {ILinqEndless} from "../ILinq/ILinqEndless";


export function range(
	start:number,
	count:number,
	step:number = 1):ILinqFinite<number>
{
	return range.up(start, count, step);
}

export module range {


	export function up(
		start:number,
		count:number,
		step:number = 1):ILinqFinite<number>
	{
		if(!isFinite(start))
			throw new ArgumentOutOfRangeException("start", start, "Must be a finite number.");

		if(!(count>0))
			return empty();

		if(!step)
			throw new ArgumentOutOfRangeException("step", step, "Must be a valid value");

		if(!isFinite(step))
			throw new ArgumentOutOfRangeException("step", step, "Must be a finite number.");

		Integer.assert(count, "count");

		return new FiniteLinqEnumerable<number>(
			() => {
				let value:number;
				let c:number = count; // Force integer evaluation.
				let index:number = 0;

				return new FiniteEnumeratorBase<number>(
					() => {
						index = 0;
						value = start;
					},

					(yielder) => {
						let result:boolean =
							    index++<c
							    && yielder.yieldReturn(value);

						if(result && index<count)
							value += step;

						return result;
					}
				);
			});
	}

	export function down(
		start:number,
		count:number,
		step:number = 1):ILinqFinite<number>
	{
		step = Math.abs(step)* -1;

		return up(start, count, step);
	}

// step = -1 behaves the same as toNegativeInfinity;
	export function toInfinity(
		start:number = 0,
		step:number  = 1):EndlessLinqEnumerable<number>
	{
		if(!isFinite(start))
			throw new ArgumentOutOfRangeException("start", start, "Must be a finite number.");

		if(!step)
			throw new ArgumentOutOfRangeException("step", step, "Must be a valid value");

		if(!isFinite(step))
			throw new ArgumentOutOfRangeException("step", step, "Must be a finite number.");

		return new EndlessLinqEnumerable<number>(
			() => {
				let value:number;

				return new EndlessEnumeratorBase<number>(
					() => {
						value = start;
					},

					(yielder) => {
						let current:number = value;
						value += step;
						return yielder.yieldReturn(current);
					}
				);
			}
		);
	}

	export function toNegativeInfinity(
		start:number = 0,
		step:number  = 1):ILinqEndless<number>
	{
		return toInfinity(start, -step);
	}

	export function to(
		start:number,
		to:number,
		step:number = 1):FiniteLinqEnumerable<number>
	{
		if(isNaN(to) || !isFinite(to))
			throw new ArgumentOutOfRangeException("to", to, "Must be a finite number.");

		if(step && !isFinite(step))
			throw new ArgumentOutOfRangeException("step", step, "Must be a finite non-zero number.");

// This way we adjust for the delta from start and to so the user can say +/- step and it will work as expected.
		step = Math.abs(step);

		return new FiniteLinqEnumerable<number>(
			() => {
				let value:number;

				return new FiniteEnumeratorBase<number>(() => { value = start; },
					start<to
						? yielder => {
							let result:boolean = value<=to && yielder.yieldReturn(value);

							if(result)
								value += step;

							return result;
						}
						: yielder => {
							let result:boolean = value>=to && yielder.yieldReturn(value);

							if(result)
								value -= step;

							return result;
						});
			}
		);
	}

}

