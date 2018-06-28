import { createComparer } from "./Sorting/createComparer";
import { quickSort } from "./Sorting/quickSort";
import { Order } from "../Sorting/Order";
import { Selector } from "../../FunctionTypes";
import { Primitive } from "../../Primitive";
export { quickSort, createComparer, createComparer as default, // Allow for default import.
createComparer as by };
export declare module ArraySort {
    const quick: typeof quickSort;
    function using<TSource, TSelect extends Primitive>(target: TSource[], selector: Selector<TSource, TSelect | TSelect[]>, order?: Order | Order[], equivalentToNaN?: any): TSource[];
}
