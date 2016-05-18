/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */

///<reference path="IObserver.d.ts"/>
///<reference path="IObservable.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

// Can be used as a base class, mixin, or simply reference on how to implement the pattern.
export default
class ObservableNodeBase<T>
extends ObservableBase<T>
implements IObserver<T>
{

	onNext(value:T):void
	{
		this._onNext(value);
	}

	onError(error:Error):void
	{
		this._onError(error);
	}

	onCompleted():void
	{
		this._onCompleted();
	}
}
