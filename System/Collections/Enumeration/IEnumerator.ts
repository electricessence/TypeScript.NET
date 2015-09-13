/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

interface IEnumerator<T> {
	current: T;
	moveNext(): boolean;
	reset(): void;
	dispose(): void;
}