/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { SortContext } from "./SortContext";
import { Comparison, Selector } from "../../FunctionTypes";
import { Comparable } from "../../IComparable";
import { IComparer } from "../../IComparer";
import { Order } from "./Order";
export declare class KeySortedContext<T, TKey extends Comparable> extends SortContext<T> {
    protected _keySelector: Selector<T, TKey> | null;
    constructor(next: IComparer<T> | null, _keySelector: Selector<T, TKey> | null, order?: Order, comparer?: Comparison<T>);
    compare(a: T, b: T): number;
}
export default KeySortedContext;
