/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


module System.Collections {

	export interface IEnumerator<T> {
		current: T;
		moveNext(): boolean;
		reset(): void;
		dispose(): void;
	}

}