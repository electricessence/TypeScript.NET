///<reference path="Enumerator.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Collections {

	export interface IEnumerable<T> {
		getEnumerator(): IEnumerator<T>;
	}

	export module Enumerable
	{
		export function forEach<T>(
			enumerable: IEnumerable < T>,
			action: (element: T, index?: number) => any): void
		{
			if (enumerable)
			{
				using(enumerable.getEnumerator(), e=>
				{
					Enumerator.forEach(e, action);
				});
			}
		}

	}

}