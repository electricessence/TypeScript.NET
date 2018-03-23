/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IHashable, ISymbolizable} from "./IDictionary";
import {Selector} from "../../FunctionTypes";
import TypeOfValue from "../../Reflection/TypeOfValue";
import isPropertyKey from "../../Reflection/isPropertyKey";
import hasMethod from "../../Reflection/hasMethod";

const VOID0:undefined = void 0;
const NULL = "null", GET_SYMBOL = "getSymbol", GET_HASH_CODE = "getHashCode";
function getIdentifier(obj:any,):string|number|symbol
function getIdentifier(obj:any, throwIfUnknown:false):string|number|symbol
function getIdentifier(obj:any, throwIfUnknown:boolean):string|number|symbol|never
function getIdentifier(obj:any, unknownHandler:Selector<any,string|number|symbol>):string|number|symbol
function getIdentifier(obj:any, throwIfUnknown:boolean|Selector<any,string|number|symbol> = false):string|number|symbol|never
{
	if(isPropertyKey(obj)) return obj;
	if(obj===null) return NULL;
	if(obj===VOID0) return TypeOfValue.Undefined;

	// See ISymbolizable.
	if(hasMethod<ISymbolizable>(obj, GET_SYMBOL))
	{
		return obj.getSymbol();
	}

	// See IHashable.
	if(hasMethod<IHashable>(obj, GET_HASH_CODE))
	{
		return obj.getHashCode();
	}

	if(throwIfUnknown) {
		if(typeof throwIfUnknown=='function')
			return throwIfUnknown(obj);
		else
			throw "Cannot create known identity.";
	}

	return (typeof obj.toString==TypeOfValue.Function)
		? obj.toString()
		: Object.prototype.toString.call(obj);
}

export default getIdentifier;