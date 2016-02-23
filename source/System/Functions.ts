/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

'use strict'; // For compatibility with (let, const, function, class);

/**
 * Can be used statically or extended for varying different reusable function signatures.
 */
class Functions
{

	/**
	 * A typed method for use with simple selection of the parameter.
	 * @returns {T}
	 */
	Identity<T>(x:T):T
	{ return x; }

	/**
	 * Returns true.
	 * @returns {boolean}
	 */
	True():boolean
	{ return true; }

	/**
	 * Returns false.
	 * @returns {boolean}
	 */
	False():boolean
	{ return false; }

	/**
	 * Does nothing.
	 */
	Blank():void
	{ }
}

const rootFunctions:Functions = new Functions();

// Expose static versions.

module Functions
{
	/**
	 * A typed method for use with simple selection of the parameter.
	 * @returns {boolean}
	 */
	export var Identity:<T>(x:T) => T
		= rootFunctions.Identity;

	/**
	 * Returns false.
	 * @returns {boolean}
	 */
	export var True:() => boolean
		= rootFunctions.True;

	/**
	 * Returns false.
	 * @returns {boolean}
	 */
	export var False:() => boolean
		= rootFunctions.False;

	/**
	 * Does nothing.
	 */
	export var Blank:() => void
		= rootFunctions.Blank;
}

// Make this read only.  Should still allow for sub-classing since extra methods are added to prototype.
Object.freeze(Functions);

export default Functions;

