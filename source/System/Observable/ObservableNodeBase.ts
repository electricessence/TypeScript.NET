/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */

///<reference path="IObserver.d.ts"/>
///<reference path="IObservable.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import SubscribableBase from './SubscribableBase';

// Can be used as a base class, mixin, or simply reference on how to implement the pattern.
export default
class ObservableNodeBase<T>
extends SubscribableBase<IObserver<T>> implements IObservable<T>, IObserver<T>
{

	onNext(value:T):void
	{
		processAction(
			this._getSubscribers(),
			s => { s.onNext && s.onNext(value); }
		);
	}

	onError(error:Error):void
	{
		processAction(
			this._getSubscribers(),
			s => { s.onError && s.onError(error); }
		);
	}

	onCompleted():void
	{
		processAction(
			this._unsubscribeAll(true),
			s => { s.onCompleted && s.onCompleted(); }
		);
	}
}

const OBSERVER_ERROR_MESSAGE:string = 'One or more observers had errors when attempting to pass information.';

function processAction<T>(
	observers:IObserver<T>[],
	handler:(s:IObserver<T>)=>void)
{
	var observersErrors:{observer:IObserver<T>,ex:any}[] = null;

	for(let s of observers)
	{
		try
		{
			handler(s);
		}
		catch(ex)
		{
			observersErrors = observersErrors || [];
			// Don't let one error prevent others from recieving information.
			observersErrors.push({observer: s, ex: ex});
		}
	}

	observers.length = 0;

	if(observersErrors && observersErrors.length)
	{
		if(console && console.error)
			console.error(OBSERVER_ERROR_MESSAGE, observersErrors);
		else throw {
			message: OBSERVER_ERROR_MESSAGE,
			errors: observersErrors
		};
	}

}
