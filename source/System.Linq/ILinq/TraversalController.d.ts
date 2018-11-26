/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import EnumerableOrArrayLike from "../../System/Collections/EnumerableOrArrayLike";
import {Selector, SelectorWithIndex} from "../../System/FunctionTypes";
import ILinqBase from "./ILinqBase";

export type Descendants<T> = EnumerableOrArrayLike<T> | null | undefined;

export interface TraversalController<T>
{
	depth(
		descendantSelector:Selector<T, Descendants<T>>):ILinqBase<T>;

	depth<TResult>(
		descendantSelector:Selector<T, Descendants<T>>,
		resultSelector:SelectorWithIndex<T, TResult>):ILinqBase<TResult>;

	depth<TNode>(
		descendantSelector:Selector<T | TNode, Descendants<T>>):ILinqBase<TNode>;

	depth<TNode, TResult>(
		descendantSelector:(element:T | TNode) => Descendants<T>,
		resultSelector:SelectorWithIndex<T, TResult>):ILinqBase<TResult>;

	breadth(
		descendantSelector:Selector<T, Descendants<T>>):ILinqBase<T>;

	breadth<TResult>(
		descendantSelector:Selector<T, Descendants<T>>,
		resultSelector:SelectorWithIndex<T, TResult>):ILinqBase<TResult>;

	breadth<TNode>(
		descendantSelector:Selector<T | TNode, Descendants<T>>):ILinqBase<TNode>;

	breadth<TNode, TResult>(
		descendantSelector:Selector<T | TNode, Descendants<T>>,
		resultSelector:SelectorWithIndex<T, TResult>):ILinqBase<TResult>;
}