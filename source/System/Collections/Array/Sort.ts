import createComparer from "./Sorting/createComparer";
import quickSort from "./Sorting/quickSort";
import Order from "../Sorting/Order";
import {Selector} from "../../FunctionTypes";
import Primitive from "../../Primitive";

export {
	quickSort,
	createComparer,
	createComparer as default, // Allow for default import.
	createComparer as by // Alias for Sort.by(...) instead of Sort.createComparer
}

export module ArraySort {
	export const quick = quickSort;


	export function using<TSource, TSelect extends Primitive>(
		target:TSource[],
		selector:Selector<TSource,TSelect|TSelect[]>,
		order:Order | Order[] = Order.Ascending,
		equivalentToNaN:any = NaN):TSource[]
	{
		return target.sort(createComparer(selector, order, equivalentToNaN));
	}
}
