/*
* @author electricessence / https://github.com/electricessence/
* Based upon .NET source.
* Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
* Source:
*   http://referencesource.microsoft.com/#mscorlib/system/IObservable.cs
*   https://msdn.microsoft.com/en-us/library/dd990377.aspx
*/

///<reference path="IObserver"/>
///<reference path="ISubscribable"/>

interface IObservable<T> extends ISubscribable<IObserver<T>>
{
}
