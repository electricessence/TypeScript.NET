/*
* @author electricessence / https://github.com/electricessence/
* Based upon .NET source.
* Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
*/

module System
{

	// http://referencesource.microsoft.com/#mscorlib/system/iobservable.cs
	// https://msdn.microsoft.com/en-us/library/dd990377.aspx
	export interface IObservable<T> // <out T>
	{
		subscribe(observer: IObserver<T>): IDisposable;
  	}

}