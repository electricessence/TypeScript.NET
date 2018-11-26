/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


// #region Projection and Filtering Methods
import EnumerableOrArrayLike from "../../System/Collections/EnumerableOrArrayLike";
import Functions from "../../System/Functions";
import EnumeratorBase from "../../System/Collections/Enumeration/EnumeratorBase";
import throwObjectDisposed from "../throwObjectDisposed";
import dispose from "../../System/Disposable/dispose";

traverseDepthFirst(
	childrenSelector;:(element:T) => EnumerableOrArrayLike<T> | null | undefined;):LinqEnumerable<T>;

traverseDepthFirst<TNode>(
	childrenSelector;:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined;):LinqEnumerable<TNode>;

traverseDepthFirst<TResult>(
	childrenSelector;:(element:T) => EnumerableOrArrayLike<T> | null | undefined,
	resultSelector;:SelectorWithIndex<T, TResult>;):LinqEnumerable<TResult>;

traverseDepthFirst<TNode, TResult>(
	childrenSelector;:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined,
	resultSelector;:SelectorWithIndex<T, TResult>;):LinqEnumerable<TResult>;

traverseDepthFirst<TNode>(
	childrenSelector;:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined,
	resultSelector;:(
	element:TNode,
	nestLevel:number) => any = <any>Functions.Identity;):LinqEnumerable<any>
{
	const _ = this;
let disposed = !_.throwObjectDisposed();

const isEndless = _.isEndless; // Is endless is not affirmative if false.

return new LinqEnumerable<any>(
	() => {
		// Dev Note: May want to consider using an actual stack and not an array.
		let enumeratorStack:IEnumerator<any>[];
		let enumerator:IEnumerator<any>;
		let len:number;  // Avoid using push/pop since they query .length every time and can be slower.

		return new EnumeratorBase<T>(
			() => {
				throwObjectDisposed(disposed);
				enumerator = _.getEnumerator();
				enumeratorStack = [];
				len = 0;
			},

			(yielder) => {
				throwObjectDisposed(disposed);
				while(true)
				{
					if(enumerator.moveNext())
					{
						let value = resultSelector(<TNode>enumerator.current, len);
						enumeratorStack[len++] = enumerator;
						let c = childrenSelector(<T | TNode>enumerator.current);
						let e = !Type.isString(c) && Enumerable.fromAny(c);
						enumerator = e ? e.getEnumerator() : EmptyEnumerator;
						return yielder.yieldReturn(value);
					}

					if(len==0) return false;

					enumerator.dispose();
					enumerator = enumeratorStack[--len];
					enumeratorStack.length = len;
				}
			},

			() => {
				try
				{
					if(enumerator) enumerator.dispose();
				}
				finally
				{
					if(enumeratorStack)
					{
						dispose.these.noCopy(enumeratorStack);
						enumeratorStack.length = 0;
						enumeratorStack = <any>null;
					}
				}
			},

			isEndless
		);
	},
	() => {
		disposed = true;
	},
	isEndless
);
}


flatten<TFlat>();:LinqEnumerable<TFlat>
flatten();:LinqEnumerable<any>
flatten();:LinqEnumerable<any>
{
	return this._selectMany(entry => {
		let e = !Type.isString(entry) && Enumerable.fromAny(entry);
		return e ? e.flatten() : [entry];
	});
}
