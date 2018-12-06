/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import FiniteEnumerableOrArrayLike from "../../System/Collections/FiniteEnumerableOrArrayLike";
import Dictionary from "../../System/Collections/Dictionaries/Dictionary";
import {EnumeratorBase} from "../../System/Collections/Enumeration/EnumeratorBase";
import * as enumUtil from "../../System/Collections/Enumeration/Enumerator";
import {Func, HashSelector, Predicate} from "../../System/FunctionTypes";

export default function<T>(
	second:FiniteEnumerableOrArrayLike<T>,
	compareSelector?:HashSelector<T>):Func<Predicate<T>>
{
	const _ = this;
	let disposed = !_.throwIfDisposed();
	_.
	const; isEndless = _.isEndless;

	return _._createEnumerable(
		() => {
			let enumerator:IEnumerator<T>;
			let keys:Dictionary<T, boolean>;

			return new EnumeratorBase<T>(
				() => {
					throwIfDisposed(disposed);
					enumerator = _.getEnumerator();
					keys = new Dictionary<T, boolean>(compareSelector);
					if(second)
						enumUtil.forEach(second, key => { keys.addByKeyValue(key, true) });
				},

				(yielder) => {
					throwIfDisposed(disposed);
					while(enumerator.moveNext())
					{
						let current = <T>enumerator.current;
						if(!keys.containsKey(current))
						{
							keys.addByKeyValue(current, true);
							return yielder.yieldReturn(current);
						}
					}
					return false;
				},

				() => {
					if(enumerator) enumerator.dispose();
					keys.clear();
				},

				isEndless
			);
		},

		() => {
			disposed = true;
		}
	);
}