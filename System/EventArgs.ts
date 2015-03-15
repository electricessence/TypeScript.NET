///<reference path="System.ts"/>
///<reference path="IDisposable.ts"/>
///<reference path="Collections/ArrayUtility.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System
{

	// This basically ends up being a placeholder base class for having other event args classes.
	// It also allows for the use of instanceOf if you derive from this class.
	// In the end, it is not a requirement to use EventArgs but a means for allowing a familiar pattern.
	export class EventArgs implements IEquatable<EventArgs>
	{

		constructor()
		{
		}

		equals(other: EventArgs): boolean
		{
			return this == other;
		}


		static get empty(): EventArgs
		{
			return empty;
		}

	}

	var empty = new EventArgs();

}  