/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Selector } from "../../FunctionTypes";
import { IEnumerator } from "./IEnumerator";
import { IEnumerable } from "./IEnumerable";
import { IEnumerableOrArray } from "../IEnumerableOrArray";
import { InfiniteValueFactory } from "./InfiniteEnumerator";
import { IIterator } from "./IIterator";
export declare function throwIfEndless(isEndless: boolean): void;
export declare function from<T>(source: IEnumerableOrArray<T> | InfiniteValueFactory<T> | IIterator<T>): IEnumerator<T>;
export declare function isEnumerable<T>(instance: any): instance is IEnumerable<T>;
export declare function isEnumerableOrArrayLike<T>(instance: any): instance is IEnumerableOrArray<T>;
export declare function isEnumerator<T>(instance: any): instance is IEnumerator<T>;
export declare function isIterator<T>(instance: any): instance is IIterator<T>;
export declare function forEach<T>(e: IEnumerableOrArray<T> | IEnumerator<T> | IIterator<T>, action: (element: T, index?: number) => any, max?: number): number;
export declare function toArray<T>(source: IEnumerableOrArray<T> | IEnumerator<T>, max?: number): T[];
export declare function map<T, TResult>(source: IEnumerableOrArray<T> | IEnumerator<T>, selector: Selector<T, TResult>, max?: number): TResult[];
