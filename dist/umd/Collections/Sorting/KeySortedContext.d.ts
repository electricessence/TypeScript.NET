/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Comparison, Selector } from "../../FunctionTypes";
import { Comparable } from "../../Comparison/IComparable";
import IComparer from "../../Comparison/IComparer";
import SortContext from "./SortContext";
import Order from "./Order";
export default class KeySortedContext<T, TKey extends Comparable> extends SortContext<T> {
    protected _keySelector: Selector<T, TKey> | null;
    constructor(next: IComparer<T> | null, _keySelector: Selector<T, TKey> | null, order?: Order, comparer?: Comparison<T>);
    compare(a: T, b: T): number;
}
