/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="ITimeMeasurement.d.ts"/>
///<reference path="../IEquatable.d.ts"/>
///<reference path="../IComparable.d.ts"/>
///<reference path="../IFormattable.d.ts"/>
import {areEqual, compare} from '../Compare';
import TimeUnit from './TimeUnit';
import TimeSpan from './TimeSpan';

// This class allows for passing around a specific measure of time coerced by its unit type.
export default
class TimeUnitValue implements IEquatable<TimeUnitValue>, IComparable<TimeUnitValue>, ITimeTotal
{

	constructor(public value:number, private _type:TimeUnit)
	{
		assertValidUnit(_type);
	}


	// Attempts to convert value to current unit type.
	// If not coercible, it returns null.
	coerce(other:TimeSpan):TimeUnitValue;
	coerce(other:TimeUnitValue):TimeUnitValue;
	coerce(other:any):TimeUnitValue
	{
		var type = this._type;
		assertValidUnit(type);

		if(other instanceof TimeSpan) {
			other = other.toTimeUnitValue(type);
		}
		else if(other instanceof TimeUnitValue) {
			if(type!==other.type)
				other = other.to(type);
		}
		else
			return null;

		return other;
	}

	equals(other:TimeSpan):boolean;
	equals(other:TimeUnitValue):boolean;
	equals(other:any):boolean
	{
		var o:TimeUnitValue = this.coerce(other);
		if(o==null)
			return false;

		return areEqual(this.value, o.value);
	}


	compareTo(other:TimeSpan):number;
	compareTo(other:TimeUnitValue):number;
	compareTo(other:any):number
	{
		if(other==null) return 1 | 0;

		assertComparisonType(other);

		return compare(this.value, this.coerce(other).value);

	}

	// To avoid confusion, the unit type can only be set once at construction.
	get type():TimeUnit
	{
		return this._type;
	}

	toTimeSpan():TimeSpan
	{
		return new TimeSpan(this.value, this.type);
	}

	get total():ITimeMeasurement {
		return this.toTimeSpan();
	}

	to(units:TimeUnit = this.type):TimeUnitValue
	{
		return this.toTimeSpan().toTimeUnitValue(units);
	}

}

function assertComparisonType(other:any):void
{
	if(!(other instanceof TimeUnitValue || other instanceof TimeSpan))
		throw new Error("Invalid comparison type.  Must be of type TimeUnitValue or TimeSpan.");
}


function assertValidUnit(unit:TimeUnit):boolean
{
	if(isNaN(unit) || unit>TimeUnit.Days || unit<TimeUnit.Ticks || Math.floor(unit)!==unit)
		throw new Error("Invalid TimeUnit.");

	return true;
}
