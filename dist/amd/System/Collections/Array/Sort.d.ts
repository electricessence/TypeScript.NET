/// <reference path="../../../../../source/System/FunctionTypes.d.ts" />
/// <reference path="../../../../../source/System/Collections/Sorting/Order.d.ts" />
/// <reference path="../../../../../source/System/CompareResult.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export declare function createComparer<TSource, TSelect extends Primitive>(selector: Selector<TSource | TSource[], TSelect>, order?: Order | Order[], equivalentToNaN?: any): Comparison<TSource | TSource[]>;
export { createComparer as default, createComparer as by };
