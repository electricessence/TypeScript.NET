/*
* @author electricessence / https://github.com/electricessence/
* Based upon .NET source.
* Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
* Source:
*   http://referencesource.microsoft.com/#mscorlib/system/IObservable.cs
*   https://msdn.microsoft.com/en-us/library/dd990377.aspx
*/

///<reference path="IObserver.ts"/>
///<reference path="../Disposable/IDisposable.ts"/>

interface IObservable<T> // <out T>
{
	subscribe(observer: IObserver<T>): IDisposable;
}
