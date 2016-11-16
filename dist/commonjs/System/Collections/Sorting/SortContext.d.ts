import { Comparison } from "../../FunctionTypes";
import { IComparer } from "../../IComparer";
import { Order } from "./Order";
export declare class SortContext<T> implements IComparer<T> {
    protected _next: IComparer<T> | null;
    protected _comparer: Comparison<T>;
    protected _order: Order;
    readonly order: Order;
    constructor(_next: IComparer<T> | null, _comparer?: Comparison<T>, _order?: Order);
    generateSortedIndexes(source: T[]): number[];
    compare(a: T, b: T): number;
}
export default SortContext;
