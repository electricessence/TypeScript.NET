///<reference path="PromiseState.d.ts"/>

import TaskManager from './TaskManager';

class Promise<T>
{
	promiseDispatch(resolve, op, operands)
	{
		var args = array_slice(arguments);
		if(messages)
		{
			messages.push(args);
			if(op==="when" && operands[1])
			{ // progress operand
				progressListeners.push(operands[1]);
			}
		}
		else
		{
			TaskManager.defer(()=>
			{
				resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
			});
		}
	}

	valueOf():T
	{
		if(messages)
		{
			return promise;
		}
		var nearerValue = nearer(resolvedPromise);
		if(isPromise(nearerValue))
		{
			resolvedPromise = nearerValue; // shorten chain
		}
		return nearerValue;
	}

	inspect():{state:PromiseState}
	{
		if(!resolvedPromise)
		{
			return {state: PromiseState.Pending};
		}
		return resolvedPromise.inspect();
	}
}

class Deferred
{
	constructor()
	{
	}

	become
}

function defer()
{
	/*
		if "messages" is an "Array", that indicates that the promise has not yet
		 been resolved.  If it is "undefined", it has been resolved.  Each
		 element of the messages array is itself an array of complete arguments to
		 forward to the resolved promise.  We coerce the resolution value to a
		 promise using the `resolve` function because it handles both fully
		 non-thenable values and other thenables gracefully.*/

	var messages = [], progressListeners = [], resolvedPromise;

	var deferred = Object.create(defer.prototype);
	var promise = Object.create(Promise.prototype);

	promise.promiseDispatch = function(resolve, op, operands)
	{
		var args = array_slice(arguments);
		if(messages)
		{
			messages.push(args);
			if(op==="when" && operands[1])
			{ // progress operand
				progressListeners.push(operands[1]);
			}
		}
		else
		{
			TaskManager.defer(()=>
			{
				resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
			});
		}
	};

	// XXX deprecated
	promise.valueOf = function()
	{
		if(messages)
		{
			return promise;
		}
		var nearerValue = nearer(resolvedPromise);
		if(isPromise(nearerValue))
		{
			resolvedPromise = nearerValue; // shorten chain
		}
		return nearerValue;
	};

	promise.inspect = function()
	{
		if(!resolvedPromise)
		{
			return {state: "pending"};
		}
		return resolvedPromise.inspect();
	};

	if(longStackSupport && hasStacks)
	{
		try
		{
			//noinspection ExceptionCaughtLocallyJS
			throw new Error();
		}
		catch(e)
		{
			// NOTE: don't try to use `Error.captureStackTrace` or transfer the
			// accessor around; that causes memory leaks as per GH-111. Just
			// reify the stack trace as a string ASAP.
			//
			// At the same time, cut off the first line; it's always just
			// "[object Promise]\n", as per the `toString`.
			promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
		}
	}

	// NOTE: we do the checks for `resolvedPromise` in each method, instead of
	// consolidating them into `become`, since otherwise we'd create new
	// promises with the lines `become(whatever(value))`. See e.g. GH-252.

	function become(newPromise)
	{
		resolvedPromise = newPromise;
		promise.source = newPromise;

		array_reduce(messages, function(undefined, message)
		{
			TaskManager.defer(()=>
			{
				newPromise.promiseDispatch.apply(newPromise, message);
			});
		}, void 0);

		messages = void 0;
		progressListeners = void 0;
	}

	deferred.promise = promise;
	deferred.resolve = function(value)
	{
		if(resolvedPromise)
		{
			return;
		}

		become(Q(value));
	};

	deferred.fulfill = function(value)
	{
		if(resolvedPromise)
		{
			return;
		}

		become(fulfill(value));
	};
	deferred.reject = function(reason)
	{
		if(resolvedPromise)
		{
			return;
		}

		become(reject(reason));
	};
	deferred.notify = function(progress)
	{
		if(resolvedPromise)
		{
			return;
		}

		array_reduce(progressListeners, function(undefined, progressListener)
		{
			TaskManager.defer(()=>
			{
				progressListener(progress);
			});
		}, void 0);
	};

	return deferred;
}


/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function()
{
	var self = this;
	return function(error, value)
	{
		if(error)
		{
			self.reject(error);
		}
		else if(arguments.length>2)
		{
			self.resolve(array_slice(arguments, 1));
		}
		else
		{
			self.resolve(value);
		}
	};
};
}
