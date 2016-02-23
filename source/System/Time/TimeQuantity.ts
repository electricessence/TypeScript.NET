/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="ITimeQuantity.d.ts"/>
///<reference path="../IEquatable.d.ts"/>
///<reference path="../IComparable.d.ts"/>
///<reference path="HowMany.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import {areEqual,compare} from '../Compare';
import TimeUnit from './TimeUnit';

/**
 * This class provides a simple means for storing and calculating time quantities.
 */
export default
class TimeQuantity implements IEquatable<ITimeQuantity>, IComparable<ITimeQuantity>, ITimeQuantity
{

	constructor(protected _quantity:number = 0)
	{
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
	 * @returns {CompareResult}
	 */
	compareTo(other:ITimeQuantity):number
	{
		return compare(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
	}


	// Clear this value if sub-class values change.
	protected _total:ITimeMeasurement;

	/**
	 * Returns an object with all units exposed as totals.
	 * @returns {ITimeMeasurement}
	 */
	get total():ITimeMeasurement
	{
		var t = this._total;
		if(!t)
		{
			var ms = this.getTotalMilliseconds();

			this._total = t = <ITimeMeasurement>Object.freeze({
				ticks: ms*HowMany.Ticks.Per.Millisecond,
				milliseconds: ms,
				seconds: ms/HowMany.Milliseconds.Per.Second,
				minutes: ms/HowMany.Milliseconds.Per.Minute,
				hours: ms/HowMany.Milliseconds.Per.Hour,
				days: ms/HowMany.Milliseconds.Per.Day,
			});
		}
		return t;
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
