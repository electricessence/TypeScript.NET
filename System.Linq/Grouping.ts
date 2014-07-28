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

	// Could be using System.Linq.Enumerable<TElement> but a grouping should end up being a result?
	export class Grouping<TKey, TElement> extends ArrayEnumerable<TElement> implements IGrouping<TKey, TElement>
	{
		private _groupKey: TKey;

		constructor(groupKey: TKey, elements: ()=>TElement[]);
		constructor(groupKey: TKey, elements: TElement[]);
		constructor(groupKey: TKey, elements: any)
		{
			var array: TElement[];
			if (typeof elements == System.Types.Function)
				array = elements();
			else if (!elements || elements instanceof Array)
				array = elements;
			else
				throw new Error("Invalid grouping source.");
				
			super(array);
			this._groupKey = groupKey;
		}

		get key():TKey {
			return this._groupKey;
		}
	}

} 