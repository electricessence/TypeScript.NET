///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq {

	export interface ILookup<TKey, TElement> extends System.Collections.IEnumerable<IGrouping<TKey, TElement>> {
		count: number;
		get(key: TKey): TElement[];
		contains(key: TKey): boolean;
	}

	export class Lookup<TKey, TElement> implements ILookup<TKey, TElement> {

		constructor(private _dictionary: System.Collections.Dictionary<TKey, TElement[]>) { }

		get count():number {
			return this._dictionary.count;
		}

		get(key: TKey): TElement[] {
			return this._dictionary.get(key);
		}

		contains(key:TKey):boolean {
			return this._dictionary.containsKey(key);
		}

		getEnumerator(): System.Collections.IEnumerator<Grouping<TKey, TElement>> {

			var _ = this;
			var enumerator: System.Collections.IEnumerator<System.Collections.IKeyValuePair<TKey, TElement[]>>;

			return new System.Collections.EnumeratorBase<Grouping<TKey, TElement>>(
				() => enumerator = _._dictionary.getEnumerator(),
				yielder => {

					if (!enumerator.moveNext())
						return false;

					var current = enumerator.current;

					return yielder.yieldReturn(new Grouping<TKey, TElement>(current.key, current.value));
				},
				() => enumerator.dispose()
			);
		}

	}
}