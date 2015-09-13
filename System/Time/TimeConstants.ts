/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


const
	ticksPerMillisecond = 10000,
	msPerSecond = 1000,
	secondsPerMinute = 60,
	minutesPerHour = 60,
	earthHoursPerDay = 24;


module TimeConstants
{
	export module Ticks
	{
		export module Per
		{
			export const
				Millisecond:number = 10000 | 0,
				Second:number = Millisecond*1000 | 0,
				Minute:number = Second*60 | 0,
				Hour:number = Minute*60 | 0,
				Day:number = Hour*24 | 0;
		}
		export module Milliseconds
		{
			export module Per
			{
				Second:number = Millisecond*1000 | 0,
					Minute:number = Second*60 | 0,
				Hour:number = Minute*60 | 0,
				Day:number = Hour*24 | 0;

			}
		}
	}