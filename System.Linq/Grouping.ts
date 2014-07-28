///<reference path="../build/System.d.ts"/>
/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq {

	export interface IGrouping<TKey, TElement> extends System.Collections.IEnumerable<TElement> {
		key: TKey;
	}

	export class Grouping<TKey, TElement> extends ArrayEnumerable<TElement> implements IGrouping<TKey, TElement>
	{

		constructor(private _groupKey: TKey, elements: TElement[])
		{
			super(elements);
		}

		get key():TKey {
			return this._groupKey;
		}
	}

} 