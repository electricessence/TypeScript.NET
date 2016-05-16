/// <reference path="../../../../../source/System/FunctionTypes.d.ts" />
/// <reference path="../../../../../source/System/IComparer.d.ts" />
/// <reference path="../../../../../source/System/Collections/Array/IArray.d.ts" />
/// <reference path="../../../../../source/System/Collections/Sorting/Order.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export default class SortContext<T> implements IComparer<T> {
    protected _next: IComparer<T>;
    protected _comparer: Comparison<T>;
    protected _order: Order;
    order: Order;
    constructor(_next: IComparer<T>, _comparer?: Comparison<T>, _order?: Order);
    generateSortedIndexes(source: T[]): number[];
    compare(a: T, b: T): number;
}
