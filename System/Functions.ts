/*
* @author electricessence / https://github.com/electricessence/
* Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
*/

module System
{
	"use strict";

	export class Functions
	{

		Identity<T>(x: T) { return x; }
		True() { return true }
		False() { return false }
		Blank() { }

		static get Identity(): <T>(x: T) => T
		{
			return rootFunctions.Identity;
		}
		static get True(): () => boolean
		{
			return rootFunctions.True;
		}
		static get False(): () => boolean
		{
			return rootFunctions.False;
		}
		static get Blank(): () => void
		{
			return rootFunctions.Blank;
		}
	}

	var rootFunctions: Functions = new Functions();
}
