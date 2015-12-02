enum PromiseState {
	Pending,
	Fulfilled,
	Rejected,
	Unknown
}

const VOID0:any = void 0;

class Promise
{
	constructor(descriptor, fallback, public inspect)
	{

		if(fallback===VOID0)
		{
			fallback = function(op)
			{
				return reject(new Error(
					"Promise does not support operation: " + op
				));
			};
		}
		if(inspect===VOID0)
		{
			inspect = function()
			{
				return {state: "unknown"};
			};
		}

		var promise = Object.create(Promise.prototype);

		promise.promiseDispatch = function(resolve, op, args)
		{
			var result;
			try
			{
				if(descriptor[op])
				{
					result = descriptor[op].apply(promise, args);
				}
				else
				{
					result = fallback.call(promise, op, args);
				}
			}
			catch(exception)
			{
				result = reject(exception);
			}
			if(resolve)
			{
				resolve(result);
			}
		};

		promise.inspect = inspect;

		// XXX deprecated `valueOf` and `exception` support
		if(inspect)
		{
			var inspected = inspect();
			if(inspected.state==="rejected")
			{
				promise.exception = inspected.reason;
			}

			promise.valueOf = function()
			{
				var inspected = inspect();
				if(inspected.state==="pending" ||
					inspected.state==="rejected")
				{
					return promise;
				}
				return inspected.value;
			};
		}

		return promise;
	}

	toString()
	{
		return "[object Promise]";
	}

	then(fulfilled, rejected, progressed)
	{
		var self = this;
		var deferred = defer();
		var done = false;   // ensure the untrusted promise makes at most a
	                        // single call to one of the callbacks

		function _fulfilled(value)
		{
			try
			{
				return typeof fulfilled==="function" ? fulfilled(value) : value;
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
				makeStackTraceLong(exception, self);
				try
				{
					return rejected(exception);
				}
				catch(newException)
				{
					return reject(newException);
				}
			}
			return reject(exception);
		}

		function _progressed(value)
		{
			return typeof progressed==="function" ? progressed(value) : value;
		}

		Q.nextTick(function()
		{
			self.promiseDispatch(function(value)
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
		self.promiseDispatch(void 0, "when", [
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

	/**
	 * Works almost like "finally", but not called for rejections.
	 * Original resolution value is passed through callback unaffected.
	 * Callback may return a promise that will be awaited for.
	 * @param {Function} callback
	 * @returns {Q.Promise}
	 * @example
	 * doSomething()
	 *   .then(...)
	 *   .tap(console.log)
	 *   .then(...);
	 */
	tap(callback)
	{
		callback = Q(callback);

		return this.then(function(value)
		{
			return callback.fcall(value).thenResolve(value);
		});
	}

	thenResolve(value)
	{
		return this.then(()=>value);
	}

	thenReject(reason:any)
	{
		return this.then(()=>{ throw reason; });
	}


	/**
	 * @returns whether the given object is a pending promise, meaning not
	 * fulfilled or rejected.
	 */


	isPending()
	{
		return this.inspect().state==="pending";
	};

	/**
	 * @returns whether the given object is a value or fulfilled
	 * promise.
	 */
	isFulfilled()
	{
		return this.inspect().state==="fulfilled";
	};

	/**
	 * @returns whether the given object is a rejected promise.
	 */

	isRejected()
	{
		return this.inspect().state==="rejected";
	}

}




