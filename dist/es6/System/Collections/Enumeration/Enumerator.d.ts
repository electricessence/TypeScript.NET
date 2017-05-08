/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ActionWithIndex, PredicateWithIndex, SelectorWithIndex } from "../../FunctionTypes";
import { IEnumerator } from "./IEnumerator";
import { IEnumerable } from "./IEnumerable";
import { IEnumerableOrArray } from "../IEnumerableOrArray";
import { InfiniteValueFactory } from "./InfiniteEnumerator";
import { IIterator } from "./IIterator";
import { ForEachEnumerable } from "./ForEachEnumerable";
export declare function throwIfEndless(isEndless: false): true;
export declare function throwIfEndless(isEndless: true): never;
export declare function throwIfEndless(isEndless: boolean | undefined): true | never;
/**
 * Returns the enumerator for the specified collection, enumerator, or iterator.
 * If the source is identified as IEnumerator it will return the source as is.
 * @param source
 * @returns {any}
 */
export declare function from<T>(source: ForEachEnumerable<T> | InfiniteValueFactory<T>): IEnumerator<T>;
export declare function isEnumerable<T>(instance: any): instance is IEnumerable<T>;
export declare function isEnumerableOrArrayLike<T>(instance: any): instance is IEnumerableOrArray<T>;
export declare function isEnumerator<T>(instance: any): instance is IEnumerator<T>;
export declare function isIterator<T>(instance: any): instance is IIterator<T>;
/**
 * Flexible method for iterating any enumerable, enumerable, iterator, array, or array-like object.
 * @param e The enumeration to loop on.
 * @param action The action to take on each.
 * @param max Stops after max is reached.  Allows for forEach to be called on infinite enumerations.
 * @returns the total times iterated.  If the enumerable is unrecognized then -1.
 */
export declare function forEach<T>(e: ForEachEnumerable<T>, action: ActionWithIndex<T>, max?: number): number;
export declare function forEach<T>(e: ForEachEnumerable<T>, action: PredicateWithIndex<T>, max?: number): number;
/**
 * Converts any enumerable to an array.
 * @param source
 * @param max Stops after max is reached.  Allows for forEach to be called on infinite enumerations.
 * @returns {any}
 */
export declare function toArray<T>(source: ForEachEnumerable<T>, max?: number): T[];
/**
 * Converts any enumerable to an array of selected values.
 * @param source
 * @param selector
 * @param max Stops after max is reached.  Allows for forEach to be called on infinite enumerations.
 * @returns {TResult[]}
 */
export declare function map<T, TResult>(source: ForEachEnumerable<T>, selector: SelectorWithIndex<T, TResult>, max?: number): TResult[];
