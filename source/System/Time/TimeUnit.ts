/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

enum TimeUnit
{
	Ticks,
	Milliseconds,
	Seconds,
	Minutes,
	Hours,
	Days
} // Earth Days

Object.freeze(TimeUnit);

export = TimeUnit;
