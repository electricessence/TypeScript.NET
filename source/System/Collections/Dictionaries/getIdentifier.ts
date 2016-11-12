/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IHashable, ISymbolizable} from "./IDictionary";
import {Type} from "../../Types";

const VOID0:undefined = void 0;
const NULL = "null", GET_SYMBOL = "getSymbol", GET_HASH_CODE = "getHashCode";
export function getIdentifier(obj:any, throwIfUnknown:boolean = false):string|number|symbol
{
	if(Type.isPropertyKey(obj)) return obj;
	if(obj===null) return NULL;
	if(obj===VOID0) return Type.UNDEFINED;

	// See ISymbolizable.
	if(Type.hasMethod<ISymbolizable>(obj, GET_SYMBOL))
	{
		return obj.getSymbol();
	}

	// See IHashable.
	if(Type.hasMethod<IHashable>(obj, GET_HASH_CODE))
	{
		return obj.getHashCode();
	}

	if(throwIfUnknown)
		throw "Cannot create known identity.";

	return (typeof obj.toString==Type.FUNCTION)
		? obj.toString()
		: Object.prototype.toString.call(obj);
}

export default getIdentifier;