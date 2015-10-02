/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


/**
 * Can be used statically or extended for varying different reusable function signatures.
 */
class Functions
{

	/**
	 * A typed method for use with simple selection of the parameter.
	 * @returns {boolean}
	 */
	Identity<T>(x:T)
	{ return x; }

	/**
	 * Returns true.
	 * @returns {boolean}
	 */
	True()
	{ return true; }

	/**
	 * Returns false.
	 * @returns {boolean}
	 */
	False()
	{ return false; }

	/**
	 * Does nothing.
	 */
	Blank()
	{ }

	/**
	 * A typed method for use with simple selection of the parameter.
	 * @returns {boolean}
	 */
	static get Identity():<T>(x:T) => T
	{
		return rootFunctions.Identity;
	}

	/**
	 * Returns false.
	 * @returns {boolean}
	 */
	static get True():() => boolean
	{
		return rootFunctions.True;
	}

	/**
	 * Returns false.
	 * @returns {boolean}
	 */
	static get False():() => boolean
	{
		return rootFunctions.False;
	}

	/**
	 * Does nothing.
	 */
	static get Blank():() => void
	{
		return rootFunctions.Blank;
	}
}

var rootFunctions:Functions = new Functions();

export = Functions;
