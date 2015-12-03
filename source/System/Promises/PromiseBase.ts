///<reference path="IPromise.d.ts"/>
///<reference path="IDeferred.d.ts"/>

import TaskManager from '../Tasks/TaskManager';

abstract class PromiseBase<T> implements IPromiseMinimal<T>
{

	promiseDispatch(resolve, op, args) {
		var result:T;
		try {
			if (descriptor[op]) {
				result = descriptor[op].apply(promise, args);
			} else {
				result = fallback.call(promise, op, args);
			}
		} catch (exception) {
			result = reject(exception);
		}
		if (resolve) {
			resolve(result);
		}
	}

	then<U>(
		onFulfill?:(value:T) => U | IPromiseMinimal<U>,
		onReject?:(error:any) => U | IPromiseMinimal<U>):IPromiseMinimal<U>
	{
		var _ = this;
		var deferred:IDeferredMinimal<U> = defer();
		var done = false;
		// ensure the untrusted promise makes at most a
	    // single call to one of the callbacks

		function _fulfilled(value:T)
		{
			try
			{
				return typeof onFullfill==="function" ? onFullfill(value) : value;
			}
			catch(exception)
			{
				return reject(exception);
			}
		}

		function _rejected(exception)
		{
			if(typeof rejected==="function")
			{
				makeStackTraceLong(exception, _);
				try
				{
					return onReject(exception);
				}
				catch(newException)
				{
					return reject(newException);
				}
			}
			return reject(exception);
		}


		TaskManager.defer(()=>
		{
			_.promiseDispatch(function(value:T)
			{
				if(done)
				{
					return;
				}
				done = true;

				deferred.resolve(_fulfilled(value));
			}, "when", [
				function(exception)
				{
					if(done)
					{
						return;
					}
					done = true;

					deferred.resolve(_rejected(exception));
				}
			]);
		});

		// Progress propagator need to be attached in the current tick.
		_.promiseDispatch(void 0, "when", [
			void 0, function(value)
			{
				var newValue;
				var threw = false;
				try
				{
					newValue = _progressed(value);
				}
				catch(e)
				{
					threw = true;
					if(Q.onerror)
					{
						Q.onerror(e);
					}
					else
					{
						throw e;
					}
				}

				if(!threw)
				{
					deferred.notify(newValue);
				}
			}
		]);

		return deferred.promise;
	}


}
