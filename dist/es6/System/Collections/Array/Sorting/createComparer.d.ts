import { Primitive } from "../../../Primitive";
import { Selector, Comparison } from "../../../FunctionTypes";
import { Order } from "../../Sorting/Order";
/**
 * A factory function that creates a comparer to be used in multi-dimensional sorting.
 *
 * <h4>Example</h4>
 * ```typescript
 * var myArray = [{a:1:b:2},{a:3,b:4},{a:1,b:3}];
 *
 * // First sort by a, then by b.
 * myArray.sort(
 *   createComparer(
 *     (e)=> [e.a, e.b],
 *     [Order.Ascending, Order.Descending]
 *   )
 * );
 *
 * // result: [{a:1,b:3},{a:1:b:2},{a:3,b:4}]
 * ```
 *
 * @param selector
 * @param order
 * @param equivalentToNaN
 * @returns {function((TSource|TSource[]), (TSource|TSource[])): CompareResult}
 */
export declare function createComparer<TSource, TSelect extends Primitive>(selector: Selector<TSource | TSource[], TSelect>, order?: Order | Order[], equivalentToNaN?: any): Comparison<TSource | TSource[]>;
