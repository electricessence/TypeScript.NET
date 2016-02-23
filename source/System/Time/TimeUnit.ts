/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="ITimeQuantity.d.ts"/>
///<reference path="HowMany.ts"/>


enum TimeUnit
{
	Ticks,
	Milliseconds,
	Seconds,
	Minutes,
	Hours,
	Days
} // Earth Days

module TimeUnit
{

	export function toMilliseconds(
		value:number,
		units:TimeUnit = TimeUnit.Milliseconds):number
	{
		// noinspection FallThroughInSwitchStatementJS
		switch(units)
		{
			case TimeUnit.Days:
				value *= HowMany.Hours.Per.Day;
			case TimeUnit.Hours:
				value *= HowMany.Minutes.Per.Hour;
			case TimeUnit.Minutes:
				value *= HowMany.Seconds.Per.Minute;
			case TimeUnit.Seconds:
				value *= HowMany.Milliseconds.Per.Second;
			case TimeUnit.Milliseconds:
				return value;
			case TimeUnit.Ticks:
				return value/HowMany.Ticks.Per.Millisecond;
			default:
				throw new Error("Invalid TimeUnit.");
		}
	}

	export function fromMilliseconds(
		ms:number,
		units:TimeUnit)
	{
		switch(units)
		{
			case TimeUnit.Days:
				return ms/HowMany.Milliseconds.Per.Day;
			case TimeUnit.Hours:
				return ms/HowMany.Milliseconds.Per.Hour;
			case TimeUnit.Minutes:
				return ms/HowMany.Milliseconds.Per.Minute;
			case TimeUnit.Seconds:
				return ms/HowMany.Milliseconds.Per.Second;
			case TimeUnit.Milliseconds:
				return ms;
			case TimeUnit.Ticks:
				return ms*HowMany.Ticks.Per.Millisecond;
			default:
				throw new Error("Invalid TimeUnit.");
		}
	}

	export function from(quantity:ITimeQuantity, unit:TimeUnit):number {
		return quantity && fromMilliseconds(quantity.getTotalMilliseconds(),unit);
	}


	export function assertValid(unit:TimeUnit):boolean
	{
		if(isNaN(unit) || unit>TimeUnit.Days || unit<TimeUnit.Ticks || Math.floor(unit)!==unit)
			throw new Error("Invalid TimeUnit.");

		return true;
	}

}

Object.freeze(TimeUnit);

export default TimeUnit;
