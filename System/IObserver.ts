/*
* @author electricessence / https://github.com/electricessence/
* Based upon .NET source.
* Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
*/

module System
{

	// http://referencesource.microsoft.com/#mscorlib/system/iobserver.cs
	export interface IObserver<T> // <in T>
	{
        onNext(value: T): void;
        onError(error: Error): void;
        onCompleted():void;
	}


} 