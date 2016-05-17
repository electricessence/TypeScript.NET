/// <reference path="../../../../../source/System/Disposable/IDisposable.d.ts" />
/// <reference path="../../../../../source/System/Collections/Enumeration/IEnumerable.d.ts" />
/// <reference path="../../../../../source/System/Collections/Enumeration/IEnumerator.d.ts" />
/// <reference path="../../../../../source/System/Collections/Enumeration/IYield.d.ts" />
/// <reference path="../../../../../source/System/Collections/IEnumerableOrArray.d.ts" />
/// <reference path="../../../../../source/System/Collections/Enumeration/IIterator.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export declare function throwIfEndless(isEndless: boolean): void;
export declare const empty: IEnumerator<any>;
export declare function from<T>(source: IEnumerableOrArray<T>): IEnumerator<T>;
export declare function isEnumerable<T>(instance: any): instance is IEnumerable<T>;
export declare function isEnumerableOrArrayLike<T>(instance: any): instance is IEnumerableOrArray<T>;
export declare function isEnumerator<T>(instance: any): instance is IEnumerator<T>;
export declare function forEach<T>(e: IEnumerableOrArray<T> | IEnumerator<T>, action: (element: T, index?: number) => any): boolean | void;
export declare function toArray<T>(source: IEnumerableOrArray<T> | IEnumerator<T>): T[];
export declare function map<T, TResult>(source: IEnumerableOrArray<T> | IEnumerator<T>, selector: Selector<T, TResult>): TResult[];
