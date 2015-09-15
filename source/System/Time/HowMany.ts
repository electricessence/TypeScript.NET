/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module HowMany
{
	export module Hours
	{
		export module Per
		{
			export const Day:number = 24;
		}
		Object.freeze(Per);
	}
	Object.freeze(Hours);

	export module Minutes
	{
		export module Per
		{
			export const Hour:number = 60;
			export const Day:number = Hour*Hours.Per.Day;

		}
		Object.freeze(Per);

	}
	Object.freeze(Minutes);

	export module Seconds
	{
		export module Per
		{
			export const Minute:number = 60;
			export const Hour:number = Minute*Minutes.Per.Hour;
			export const Day:number = Hour*Hours.Per.Day;

		}
		Object.freeze(Per);

	}
	Object.freeze(Seconds);

	export module Milliseconds
	{
		export module Per
		{
			export const Second:number = 1000;
			export const Minute:number = Second*Seconds.Per.Minute;
			export const Hour:number = Minute*Minutes.Per.Hour;
			export const Day:number = Hour*Hours.Per.Day;

		}
		Object.freeze(Per);

	}
	Object.freeze(Milliseconds);

	export module Ticks
	{
		export module Per
		{
			export const Millisecond:number = 10000;
			export const Second:number = Millisecond*Milliseconds.Per.Second;
			export const Minute:number = Second*Seconds.Per.Minute;
			export const Hour:number = Minute*Minutes.Per.Hour;
			export const Day:number = Hour*Hours.Per.Day;
		}
		Object.freeze(Per);

	}
	Object.freeze(Ticks);

}

export = HowMany;