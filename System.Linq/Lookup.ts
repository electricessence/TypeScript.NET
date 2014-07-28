///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq {

	export interface ILookup<TKey, TElement> extends System.Collections.IEnumerable<IGrouping<TKey, TElement>> {
		count: number;
		get(key: TKey): System.Collections.IEnumerable<TElement>;
		contains(key: TKey): boolean;
	}

	export class Lookup<TKey, TElement> implements ILookup<TKey, TElement> {

		constructor(private _dictionary:System.Collections.Dictionary<TKey,IEnumerable<TElement>>) { }

		get count():number {
			return this._dictionary.count;
		}

		get(key: TKey): System.Collections.IEnumerable<TElement> {
			return this._dictionary.get(key);
		}

		contains(key:TKey):boolean {
			return this._dictionary.containsKey(key);
		}

		getEnumerator(): System.Collections.IEnumerator<IGrouping<TKey, TElement>> {
			return this.dictionary
				.toEnumerable()
				.select(
				(kvp) => new Grouping(kvp.key, kvp.value));
		}

	}
}