/// <reference path="../../../../../source/System/FunctionTypes.d.ts" />
/// <reference path="../../../../../source/System/IComparer.d.ts" />
/// <reference path="../../../../../source/System/Primitive.d.ts" />
/// <reference path="../../../../../source/System/Collections/Array/IArray.d.ts" />
/// <reference path="../../../../../source/System/Collections/Sorting/Order.d.ts" />
/// <reference path="../../../../../source/System/IComparable.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import SortContext from "./SortContext";
export default class KeySortedContext<T, TKey extends Comparable> extends SortContext<T> {
    protected _keySelector: Selector<T, TKey>;
    constructor(next: IComparer<T>, _keySelector: Selector<T, TKey>, order?: Order, comparer?: Comparison<T>);
    compare(a: T, b: T): number;
}
