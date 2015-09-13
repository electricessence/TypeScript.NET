/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

'use strict';

// This is exposed as a class to allow for extending.
class Functions
{

	Identity<T>(x:T) { return x; }

	True() { return true; }

	False() { return false; }

	Blank() { }

	static get Identity():<T>(x:T) => T
	{
		return rootFunctions.Identity;
	}

	static get True():() => boolean
	{
		return rootFunctions.True;
	}

	static get False():() => boolean
	{
		return rootFunctions.False;
	}

	static get Blank():() => void
	{
		return rootFunctions.Blank;
	}
}

var rootFunctions:Functions = new Functions();

export = Functions;