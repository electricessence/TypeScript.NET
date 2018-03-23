/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import IDisposable from "./Disposable/IDisposable";
import IEquatable from "./IEquatable";

export default interface ILazy<T> extends IDisposable, IEquatable<ILazy<T>>
{
	value:T;
	isValueCreated:boolean;
}
