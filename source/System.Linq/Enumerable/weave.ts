/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import * as enumUtil from "../../System/Collections/Enumeration/Enumerator";
import IEnumerator, {FiniteIEnumerator} from "../../System/Collections/Enumeration/IEnumerator";
import FiniteEnumerableOrArrayLike from "../../System/Collections/FiniteEnumerableOrArrayLike";
import ArgumentNullException from "../../System/Exceptions/ArgumentNullException";
import Queue from "../../System/Collections/Queue";
import {FiniteEnumeratorBase} from "../../System/Collections/Enumeration/EnumeratorBase";
import {dispose} from "../../System/Disposable/dispose";
import {FiniteLinqEnumerable} from "../Linq";
import throwObjectDisposed from "../throwObjectDisposed";

/**
 * Takes any set of collections of the same type and weaves them together.
 * @param enumerables
 * @returns {Enumerable<T>}
 */
export function weave<T>(
	enumerables:FiniteEnumerableOrArrayLike<FiniteEnumerableOrArrayLike<T>>):FiniteLinqEnumerable<T>
{
	if(!enumerables)
		throw new ArgumentNullException('enumerables');

	let disposed = false;
	return new FiniteLinqEnumerable<T>(
		() => {
			let queue:Queue<IEnumerator<T>>;
			let mainEnumerator:FiniteIEnumerator<FiniteEnumerableOrArrayLike<T>> | null;
			let index:number;

			return new FiniteEnumeratorBase<T>(
				() => {
					throwObjectDisposed(disposed, "FiniteLinqEnumerable");
					index = 0;
					queue = new Queue<IEnumerator<T>>();
					mainEnumerator = enumUtil.from(enumerables);
				},

				(yielder) => {
					throwObjectDisposed(disposed, "FiniteLinqEnumerable");
					let e:IEnumerator<T> | null = null;

					// First pass...
					if(mainEnumerator)
					{
						while(!e && mainEnumerator.moveNext())
						{
							let c = mainEnumerator.current;
							e = nextEnumerator(queue, c ? enumUtil.from(c) : <any>null);
						}

						if(!e)
							mainEnumerator = null;
					}

					while(!e && queue.tryDequeue(value => {
						e = nextEnumerator(queue, enumUtil.from<T>(value));
					}))
					{ }

					return e
						? yielder.yieldReturn(e.current)
						: yielder.yieldBreak();

				},

				() => {
					if(queue)
					{
						dispose.these.noCopy(queue.dump());
						queue = <any>null;
					}
					if(mainEnumerator) mainEnumerator.dispose();
					mainEnumerator = null;
				}
			);
		},
		() => {
			disposed = true;
		}
	);
}

function nextEnumerator<T>(queue:Queue<IEnumerator<T>>, e:IEnumerator<T>):IEnumerator<T> | null
{
	if(e)
	{
		if(e.moveNext())
		{
			queue.enqueue(e);
		}
		else
		{
			if(e) e.dispose();
			return null;
		}
	}
	return e;
}