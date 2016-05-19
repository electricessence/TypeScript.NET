/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {TimeUnit} from "./TimeUnit";
import {TimeQuantity} from "./TimeQuantity";
import {ITimeQuantity} from "./ITimeQuantity";

/**
 * TimeUnitValue allows for passing around a reference to a changeable measure of time coerced by its unit type.
 */
export default
class TimeUnitValue extends TimeQuantity
{

	constructor(value:number|ITimeQuantity, private _units:TimeUnit)
	{
		super(typeof(value)=='number'
			? <number>value
			: getUnitQuantityFrom(<ITimeQuantity>value, _units));
		TimeUnit.assertValid(_units);
	}

	get value():number
	{
		return this._quantity;
	}

	set value(v:number)
	{
		this._total = null;
		this._quantity = v;
	}

	getTotalMilliseconds():number
	{
		return TimeUnit.toMilliseconds(this._quantity, this._units);
	}

	// To avoid confusion, the unit type can only be set once at construction.
	get units():TimeUnit
	{
		return this._units;
	}

	to(units:TimeUnit = this.units):TimeUnitValue
	{
		return TimeUnitValue.from(this,units);
	}

	static from(value:number|ITimeQuantity, units:TimeUnit = TimeUnit.Milliseconds):TimeUnitValue
	{
		return new TimeUnitValue(value, units);
	}

}

function getUnitQuantityFrom(q:ITimeQuantity, units:TimeUnit)
{
	return TimeUnit.fromMilliseconds(q.getTotalMilliseconds(), units);
}
