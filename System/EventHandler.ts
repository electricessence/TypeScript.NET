///<reference path="System.ts"/>
///<reference path="IDisposable.ts"/>
///<reference path="Collections/ArrayUtility.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System
{

	// Another placeholder for allowing for extending a recognizable pattern.

	export interface EventHandler
	{
		(sender: Object, e: EventArgs):void
	}


}   