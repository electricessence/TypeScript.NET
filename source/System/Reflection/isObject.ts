/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOfValue from "./TypeOfValue";

/**
 * Returns true if the value parameter is an object.
 * @param value
 * @param allowNull If false (default) null is not considered an object.
 * @returns {boolean}
 */
export default function isObject(value:any, allowNull:boolean = false):boolean
{
	return typeof value===TypeOfValue.Object && (allowNull || value!==null);
}