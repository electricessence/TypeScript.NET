/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {areEqual, compare} from "../Compare";
import {TimeUnit} from "./TimeUnit";
import {Milliseconds, Ticks} from "./HowMany";
import {IEquatable} from "../IEquatable";
import {IComparable} from "../IComparable";
import {ITimeQuantity} from "./ITimeQuantity";
import {ITimeMeasurement} from "./ITimeMeasurement";
import {Lazy} from "../Lazy";

/**
 * This class provides a simple means for storing and calculating time quantities.
 */
export class TimeQuantity implements IEquatable<ITimeQuantity>, IComparable<ITimeQuantity>, ITimeQuantity
{

	constructor(protected _quantity:number = 0)
	{
		this._resetTotal();
	}

	// Provides an overridable mechanism for extending this class.
	getTotalMilliseconds():number
	{
		return this._quantity;
	}

	/**
	 * +1, 0, or -1 depending on the time direction.
	 * @returns {number}
	 */
	get direction():number
	{
		return compare(this.getTotalMilliseconds(), 0);
	}

	/**
	 * Compares this instance against any other time quantity instance and return true if the amount of time is the same.
	 * @param other
	 * @returns {boolean}
	 */
	equals(other:ITimeQuantity):boolean
	{
		return areEqual(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
	}

	/**
	 * Compares this instance against any other time quantity instance.
	 * @param other
	 * @returns {number}
	 */
	compareTo(other:ITimeQuantity):number
	{
		return compare(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
	}

	// @ts-ignore;
	protected _total:Lazy<ITimeMeasurement>;

	protected _resetTotal():void
	{
		const t = this._total;
		if(!t || t.isValueCreated)
		{
			this._total = Lazy.create(() =>
			{
				const ms = this.getTotalMilliseconds();

				return <ITimeMeasurement>Object.freeze({
					ticks: ms*Ticks.Per.Millisecond,
					milliseconds: ms,
					seconds: ms/Milliseconds.Per.Second,
					minutes: ms/Milliseconds.Per.Minute,
					hours: ms/Milliseconds.Per.Hour,
					days: ms/Milliseconds.Per.Day,
				});
			});
		}
	}

	/**
	 * Returns an object with all units exposed as totals.
	 * @returns {ITimeMeasurement}
	 */
	get total():ITimeMeasurement
	{
		return this._total.value;
	}

	/**
	 * Returns the total amount of time measured in the requested TimeUnit.
	 * @param units
	 * @returns {number}
	 */
	getTotal(units:TimeUnit):number
	{
		return TimeUnit.fromMilliseconds(this.getTotalMilliseconds(), units);
	}
}

export default TimeQuantity;