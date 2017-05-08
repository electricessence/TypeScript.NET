/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Comparison } from "../../FunctionTypes";
import { IComparer } from "../../IComparer";
import { Order } from "./Order";
export declare class SortContext<T> implements IComparer<T> {
    protected _next: IComparer<T> | null;
    protected _comparer: Comparison<T>;
    protected _order: Order;
    /**
     * Direction of the comparison.
     * @type {Order}
     */
    readonly order: Order;
    constructor(_next: IComparer<T> | null, _comparer?: Comparison<T>, _order?: Order);
    /**
     * Generates an array of indexes from the source in order of their expected internalSort without modifying the source.
     * @param source
     * @returns {number[]}
     */
    generateSortedIndexes(source: T[]): number[];
    /**
     * Compares two values based upon SortContext parameters.
     * @param a
     * @param b
     * @returns {any}
     */
    compare(a: T, b: T): number;
}
export default SortContext;
