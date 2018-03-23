/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import isPrimitive from "./isPrimitive";

/**
 * Will detect if a member exists (using 'in').
 * Returns true if a property or method exists on the object or its prototype.
 * @param instance
 * @param property Name of the member.
 * @param ignoreUndefined When ignoreUndefined is true, if the member exists but is undefined, it will return false.
 * @returns {boolean}
 */
export default function hasMember(instance:any, property:string, ignoreUndefined:boolean = true):boolean
{
	return instance && !isPrimitive(instance) && (property) in (instance) && (ignoreUndefined || instance[property]!==undefined);
}
