///<reference path="IEnumerator.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

import System = require('../System');

module Collections {

	export interface IEnumerable<T> {
		getEnumerator(): IEnumerator<T>;
	}

	export module Enumerable {
		export function forEach<T>(
			enumerable:IEnumerable < T>,
			action:(element:T, index?:number) => any):void
		{
			if(enumerable) {
				System.using(
					enumerable.getEnumerator(), e=>
					{
						Enumerator.forEach(e, action);
					}
				);
			}
		}

	}

}

export = Collections;