/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="Disposable/IDisposable.ts"/>
///<reference path="IEquatable.ts"/>

interface ILazy<T> extends IDisposable, IEquatable<ILazy<T>>
{
	value:T;
	isValueCreated:boolean;
}
