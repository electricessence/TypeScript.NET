/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Type} from "../Types";
import {getIdentifier} from "./Dictionaries/getIdentifier";
import {ISymbolizable} from "./Dictionaries/IDictionary";
import {HashSet} from "./HashSet";
import {Primitive} from "../Primitive";
import {IEnumerableOrArray} from "./IEnumerableOrArray";
import __extendsImport from "../../extends";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;



function getId(obj:any):string|number|symbol {
	return getIdentifier(obj, typeof obj!=Type.BOOLEAN);
}

export class Set<T extends Primitive|ISymbolizable|symbol>
extends HashSet<T>
{
	constructor(source?:IEnumerableOrArray<T>)
	{
		super(source, getId);
	}
}

export default Set;