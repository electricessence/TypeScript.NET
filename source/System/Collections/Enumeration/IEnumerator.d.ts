/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path='../../Disposable/IDisposable.d.ts'/>

interface IEnumerator<T> extends IDisposable {
	current: T;
	moveNext(): boolean;
	reset(): void;
}
