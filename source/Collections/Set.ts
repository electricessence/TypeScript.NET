/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import getIdentifier from "./Dictionaries/getIdentifier";
import {ISymbolizable} from "./Dictionaries/IDictionary";
import {HashSet} from "./HashSet";
import Primitive from "../Primitive";
import IEnumerableOrArray from "./IEnumerableOrArray";
import TypeOf from "../Reflection/TypeOf";

function getId(obj:any):string|number|symbol {
	return getIdentifier(obj, typeof obj!=TypeOf.BOOLEAN);
}

export default class Set<T extends Primitive|ISymbolizable|symbol>
extends HashSet<T>
{
	constructor(source?:IEnumerableOrArray<T>)
	{
		super(source, getId);
	}
}