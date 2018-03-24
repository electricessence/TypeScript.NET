/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOf from "./TypeOf";
import Primitive from "../Primitive";

/**
 * Returns true if the value is a boolean, string, number, null, or undefined.
 * @param value
 * @param allowUndefined if set to true will return true if the value is undefined.
 * @returns {boolean}
 */
export default function isPrimitive(value:any, allowUndefined:true):value is Primitive | undefined
export default function isPrimitive(value:any, allowUndefined:false):value is Primitive
export default function isPrimitive(value:any):value is Primitive
export default function isPrimitive(
	value:any,
	allowUndefined?:boolean):value is Primitive | undefined
export default function isPrimitive(
	value:any,
	allowUndefined:boolean = false):value is Primitive | undefined {
	const t = typeof value;
	switch(t)
	{
		case TypeOf.Boolean:
		case TypeOf.String:
		case TypeOf.Number:
			return true;
		case TypeOf.Undefined:
			return allowUndefined;
		case TypeOf.Object:
			return value===null;

	}
	return false;
}