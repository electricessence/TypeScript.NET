/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import EnumerableOrArrayLike from "../../System/Collections/EnumerableOrArrayLike";
import {Selector, SelectorWithIndex} from "../../System/FunctionTypes";
import Base from "./Base";

export type Descendants<T> = EnumerableOrArrayLike<T> | null | undefined;

export interface TraversalController<T>
{
	depth(
		descendantSelector:Selector<T, Descendants<T>>):Base<T>;

	depth<TResult>(
		descendantSelector:Selector<T, Descendants<T>>,
		resultSelector:SelectorWithIndex<T, TResult>):Base<TResult>;

	depth<TNode>(
		descendantSelector:Selector<T | TNode, Descendants<T>>):Base<TNode>;

	depth<TNode, TResult>(
		descendantSelector:(element:T | TNode) => Descendants<T>,
		resultSelector:SelectorWithIndex<T, TResult>):Base<TResult>;

	breadth(
		descendantSelector:Selector<T, Descendants<T>>):Base<T>;

	breadth<TResult>(
		descendantSelector:Selector<T, Descendants<T>>,
		resultSelector:SelectorWithIndex<T, TResult>):Base<TResult>;

	breadth<TNode>(
		descendantSelector:Selector<T | TNode, Descendants<T>>):Base<TNode>;

	breadth<TNode, TResult>(
		descendantSelector:Selector<T | TNode, Descendants<T>>,
		resultSelector:SelectorWithIndex<T, TResult>):Base<TResult>;
}