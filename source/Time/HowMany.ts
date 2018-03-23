/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export module Hours
{
	export const enum Per
	{
		Day = 24
	}
}

export module Minutes
{
	export const enum Per
	{
		Hour = 60,
		Day  = Hour*Hours.Per.Day
	}

}

export module Seconds
{
	export const enum Per
	{
		Minute = 60,
		Hour   = Minute*Minutes.Per.Hour,
		Day    = Hour*Hours.Per.Day
	}

}

export module Milliseconds
{
	export const enum Per
	{
		Second = 1000,
		Minute = Second*Seconds.Per.Minute,
		Hour   = Minute*Minutes.Per.Hour,
		Day    = Hour*Hours.Per.Day
	}

}

export module Ticks
{
	export const enum Per
	{
		Millisecond = 10000,
		Second      = Millisecond*Milliseconds.Per.Second,
		Minute      = Second*Seconds.Per.Minute,
		Hour        = Minute*Minutes.Per.Hour,
		Day         = Hour*Hours.Per.Day
	}

}