/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import TypeOf from "./TypeOf";
import Primitive from "../Primitive";
import isPrimitive from "./isPrimitive";

/**
 * For detecting if the value can be used as a key.
 * @param value
 * @param allowUndefined
 * @returns {boolean|boolean}
 */
export default function isPrimitiveOrSymbol(
	value:any,
	allowUndefined:true):value is Primitive | symbol | undefined;
export default function isPrimitiveOrSymbol(
	value:any,
	allowUndefined:false):value is Primitive | symbol;
export default function isPrimitiveOrSymbol(value:any):value is Primitive | symbol;
export default function isPrimitiveOrSymbol(
	value:any,
	allowUndefined?:boolean):value is Primitive | symbol | undefined;
export default function isPrimitiveOrSymbol(
	value:any,
	allowUndefined:boolean = false):value is Primitive | symbol {
	return typeof value===TypeOf.SYMBOL ? true : isPrimitive(value, allowUndefined);
}