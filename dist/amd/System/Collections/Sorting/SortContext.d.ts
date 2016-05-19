/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Comparison } from "../../FunctionTypes";
import { IComparer } from "../../IComparer";
import { Order } from "./Order";
export declare class SortContext<T> implements IComparer<T> {
    protected _next: IComparer<T>;
    protected _comparer: Comparison<T>;
    protected _order: Order;
    order: Order;
    constructor(_next: IComparer<T>, _comparer?: Comparison<T>, _order?: Order);
    generateSortedIndexes(source: T[]): number[];
    compare(a: T, b: T): number;
}
export default SortContext;
