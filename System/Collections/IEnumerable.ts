/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Collections {

	export interface IEnumerable<T> {
		getEnumerator(): IEnumerator<T>;
	}

}