import { Primitive } from "../../../Primitive";
import { Selector, Comparison } from "../../../FunctionTypes";
import { Order } from "../../Sorting/Order";
export declare function createComparer<TSource, TSelect extends Primitive>(selector: Selector<TSource | TSource[], TSelect>, order?: Order | Order[], equivalentToNaN?: any): Comparison<TSource | TSource[]>;
