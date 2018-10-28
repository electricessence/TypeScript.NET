/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ISymbolizable } from "./Dictionaries/IDictionary";
import { HashSet } from "./HashSet";
import { Primitive } from "../Primitive";
import { FiniteEnumerableOrArrayLike } from "./IEnumerableOrArray";
export declare class Set<T extends Primitive | ISymbolizable | symbol> extends HashSet<T> {
    constructor(source?: FiniteEnumerableOrArrayLike<T>);
}
export default Set;
