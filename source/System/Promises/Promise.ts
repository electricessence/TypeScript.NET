/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Although most of the following code is written from scratch, it is
 * heavily influenced by Q (https://github.com/kriskowal/q) and uses some of Q's spec.
 */
/*
 * Resources:
 * https://promisesaplus.com/
 * https://github.com/kriskowal/q
 */

import Type from "../Types";
import {deferImmediate} from "../Threading/deferImmediate";
import {DisposableBase} from "../Disposable/DisposableBase";
import {InvalidOperationException} from "../Exceptions/InvalidOperationException";
import {ArgumentException} from "../Exceptions/ArgumentException";
import {ArgumentNullException} from "../Exceptions/ArgumentNullException";
import {ObjectPool} from "../Disposable/ObjectPool";
import {Set} from "../Collections/Set";
import {defer} from "../Threading/defer";
import {ObjectDisposedException} from "../Disposable/ObjectDisposedException";
import __extendsImport from "../../extends";
import {Closure} from "../FunctionTypes";
//noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

const VOID0:any = void 0, NULL:any = null, PROMISE = "Promise", PROMISE_STATE = PROMISE + "State",
      THEN                                                                    = "then", TARGET                                                   = "target";

function isPromise<T>(value:any):value is PromiseLike<T>
{
	return Type.hasMemberOfType(value, THEN, Type.FUNCTION);
}

function resolve<T>(
	value:TSDNPromise.Resolution<T>, resolver:(v:TSDNPromise.Resolution<T>) => any,
	promiseFactory:(v:any) => PromiseBase<any>):PromiseBase<any>
{
	let nextValue = resolver
		? resolver(value)
		: value;

	return nextValue && isPromise(nextValue)
		? TSDNPromise.wrap(nextValue)
		: promiseFactory(nextValue);
}

function handleResolution(
	p:TSDNPromise<any> | null | undefined,
	value:TSDNPromise.Resolution<any>,
	resolver?:(v:TSDNPromise.Resolution<any>) => any):any
{
	try
	{
		let v = resolver ? resolver(value) : value;
		if(p)
		{ //noinspection JSIgnoredPromiseFromCall
			p.resolve(v);
		}
		return null;
	}
	catch(ex)
	{
		if(p)
		{ //noinspection JSIgnoredPromiseFromCall
			p.reject(ex);
		}
		return ex;
	}
}

export type Resolver = (v:TSDNPromise.Resolution<any>) => any;

function handleResolutionMethods(
	targetFulfill:TSDNPromise.Fulfill<any, any> | null | undefined,
	targetReject:TSDNPromise.Reject<any> | null | undefined,
	value:TSDNPromise.Resolution<any>,
	resolver?:Resolver | null | undefined ):void
{
	try
	{
		let v = resolver ? resolver(value) : value;
		if(targetFulfill) targetFulfill(v);
	}
	catch(ex)
	{ if(targetReject) targetReject(ex); }
}

function handleDispatch<T, TFulfilled = T, TRejected = never>(
	p:PromiseLike<T>,
	onFulfilled:TSDNPromise.Fulfill<T, TFulfilled>,
	onRejected?:TSDNPromise.Reject<TRejected>):void
{
	if(p instanceof PromiseBase)
	{
		p.doneNow(onFulfilled, onRejected);
	}
	else
	{
		p.then(<any>onFulfilled, onRejected);
	}
}

function handleSyncIfPossible<T, TFulfilled = T, TRejected = never>(
	p:PromiseLike<T>,
	onFulfilled:TSDNPromise.Fulfill<T, TFulfilled>,
	onRejected?:TSDNPromise.Reject<TRejected>):PromiseLike<TFulfilled | TRejected>
{
	if(p instanceof PromiseBase)
		return p.thenSynchronous(onFulfilled, onRejected);
	else
		return p.then(onFulfilled, onRejected);
}

function newODE()
{
	return new ObjectDisposedException("TSDNPromise", "An underlying promise-result was disposed.");
}

export class PromiseState<T>
	extends DisposableBase
{

	constructor(
		protected _state:TSDNPromise.State,
		protected _result?:T,
		protected _error?:any)
	{
		super();
		this._disposableObjectName = PROMISE_STATE;
	}

	protected _onDispose():void
	{
		this._state = VOID0;
		this._result = VOID0;
		this._error = VOID0;
	}

	protected getState():TSDNPromise.State
	{
		return this._state;
	}

	get state():TSDNPromise.State
	{
		return this._state;
	}

	get isPending():boolean
	{
		return this.getState()===TSDNPromise.State.Pending;
	}

	get isSettled():boolean
	{
		return this.getState()!=TSDNPromise.State.Pending; // Will also include undefined==0 aka disposed!=resolved.
	}

	get isFulfilled():boolean
	{
		return this.getState()===TSDNPromise.State.Fulfilled;
	}

	get isRejected():boolean
	{
		return this.getState()===TSDNPromise.State.Rejected;
	}

	/*
	 * Providing overrides allows for special defer or lazy sub classes.
	 */
	protected getResult():T | undefined
	{
		return this._result;
	}

	get result():T | undefined
	{
		this.throwIfDisposed();
		return this.getResult();
	}

	protected getError():any
	{
		return this._error;
	}

	get error():any
	{
		this.throwIfDisposed();
		return this.getError();
	}

}

export abstract class PromiseBase<T>
	extends PromiseState<T>
	implements PromiseLike<T>, Promise<T>
{
	constructor()
	{
		super(TSDNPromise.State.Pending);
		this._disposableObjectName = PROMISE;
	}

	/**
	 * .doneNow is provided as a non-standard means that synchronously resolves as the end of a promise chain.
	 * As stated by promisejs.org: 'then' is to 'done' as 'map' is to 'forEach'.
	 * It is the underlying method by which propagation occurs.
	 * @param onFulfilled
	 * @param onRejected
	 */
	abstract doneNow(
		onFulfilled:TSDNPromise.Fulfill<T, any> | undefined | null,
		onRejected?:TSDNPromise.Reject<any> | undefined | null):void;

	abstract doneNow(
		onFulfilled:(v?:T) => any | undefined | null,
		onRejected?:(v?:any) => any | undefined | null):void;


	/**
	 * Calls the respective handlers once the promise is resolved.
	 * @param onFulfilled
	 * @param onRejected
	 */
	abstract thenSynchronous<TFulfilled = T, TRejected = never>(
		onFulfilled:TSDNPromise.Fulfill<T, TFulfilled> | undefined | null,
		onRejected?:TSDNPromise.Reject<TRejected> | undefined | null):PromiseBase<TFulfilled | TRejected>;

	/**
	 * Same as 'thenSynchronous' but does not return the result.  Returns the current promise instead.
	 * You may not need an additional promise result, and this will not create a new one.
	 * @param onFulfilled
	 * @param onRejected
	 */
	thenThis(
		onFulfilled:TSDNPromise.Fulfill<T, any> | undefined | null,
		onRejected?:TSDNPromise.Reject<any> | undefined | null):this;

	thenThis(
		onFulfilled:(v?:T) => any | undefined | null,
		onRejected?:(v?:any) => any | undefined | null):this
	{
		this.doneNow(onFulfilled,onRejected);
		return this;
	}


	/**
	 * Standard .then method that defers execution until resolved.
	 * @param onFulfilled
	 * @param onRejected
	 * @returns {TSDNPromise}
	 */

	then<TFulfilled = T, TRejected = never>(
		onFulfilled:TSDNPromise.Fulfill<T, TFulfilled> | undefined | null,
		onRejected?:TSDNPromise.Reject<TRejected> | undefined | null):PromiseBase<TFulfilled | TRejected>
	{
		this.throwIfDisposed();

		return new TSDNPromise<TFulfilled | TRejected>((resolve, reject) =>
		{
			this.doneNow(
				result =>
					handleResolutionMethods(resolve, reject, result, onFulfilled),
				error =>
					onRejected
						? handleResolutionMethods(resolve, reject, error, onRejected)
						: reject(error)
			);
		});
	}

	/**
	 * Same as .then but doesn't trap errors.  Exceptions may end up being fatal.
	 * @param onFulfilled
	 * @param onRejected
	 * @returns {TSDNPromise}
	 */
	thenAllowFatal<TFulfilled = T, TRejected = never>(
		onFulfilled:TSDNPromise.Fulfill<T, TFulfilled> | undefined | null,
		onRejected?:TSDNPromise.Reject<TRejected> | undefined | null):PromiseBase<TFulfilled | TRejected>
	{
		this.throwIfDisposed();

		return new TSDNPromise<TFulfilled | TRejected>((resolve, reject) =>
		{
			this.doneNow(
				result =>
					resolve(<any>(onFulfilled ? onFulfilled(result) : result)),
				error =>
					reject(onRejected ? onRejected(error) : error)
			);
		});
	}


	/**
	 * .done is provided as a non-standard means that maps to similar functionality in other promise libraries.
	 * As stated by promisejs.org: 'then' is to 'done' as 'map' is to 'forEach'.
	 * @param onFulfilled
	 * @param onRejected
	 */
	done(
		onFulfilled:TSDNPromise.Fulfill<T, any>,
		onRejected?:TSDNPromise.Reject<any>):void
	{
		defer(() => this.doneNow(onFulfilled, onRejected));
	}

	/**
	 * Will yield for a number of milliseconds from the time called before continuing.
	 * @param milliseconds
	 * @returns A promise that yields to the current execution and executes after a delay.
	 */
	delayFromNow(milliseconds:number = 0):PromiseBase<T>
	{
		this.throwIfDisposed();

		return new TSDNPromise<T>(
			(resolve, reject) =>
			{
				defer(() =>
				{
					this.doneNow(
						v => resolve(v),
						e => reject(e));
				}, milliseconds)
			},
			true // Since the resolve/reject is deferred.
		);
	}

	/**
	 * Will yield for a number of milliseconds from after this promise resolves.
	 * If the promise is already resolved, the delay will start from now.
	 * @param milliseconds
	 * @returns A promise that yields to the current execution and executes after a delay.
	 */
	delayAfterResolve(milliseconds:number = 0):PromiseBase<T>
	{
		this.throwIfDisposed();

		if(this.isSettled) return this.delayFromNow(milliseconds);

		return new TSDNPromise<T>(
			(resolve, reject) =>
			{
				this.doneNow(
					v => defer(() => resolve(v), milliseconds),
					e => defer(() => reject(e), milliseconds))
			},
			true // Since the resolve/reject is deferred.
		);
	}

	/**
	 * Shortcut for trapping a rejection.
	 * @param onRejected
	 * @returns {PromiseBase<TResult>}
	 */
	'catch'<TResult = never>(onRejected:TSDNPromise.Reject<TResult>):PromiseBase<T | TResult>
	{
		return this.then(VOID0, onRejected)
	}

	/**
	 * Shortcut for trapping a rejection but will allow exceptions to propagate within the onRejected handler.
	 * @param onRejected
	 * @returns {PromiseBase<TResult>}
	 */
	catchAllowFatal<TResult = never>(onRejected:TSDNPromise.Reject<TResult>):PromiseBase<T | TResult>
	{
		return this.thenAllowFatal(VOID0, onRejected)
	}

	/**
	 * Shortcut to for handling either resolve or reject.
	 * @param fin
	 * @returns {PromiseBase<TResult>}
	 */
	'finally'<TResult = never>(fin:() => TSDNPromise.Resolution<TResult>):PromiseBase<TResult>
	{
		return this.then(fin, fin);
	}

	/**
	 * Shortcut to for handling either resolve or reject but will allow exceptions to propagate within the handler.
	 * @param fin
	 * @returns {PromiseBase<TResult>}
	 */
	finallyAllowFatal<TResult = never>(fin:() => TSDNPromise.Resolution<TResult>):PromiseBase<TResult>
	{
		return this.thenAllowFatal(fin, fin);
	}

	/**
	 * Shortcut to for handling either resolve or reject.  Returns the current promise instead.
	 * You may not need an additional promise result, and this will not create a new one.
	 * @param fin
	 * @param synchronous
	 * @returns {PromiseBase}
	 */
	finallyThis(fin:Closure, synchronous?:boolean):this
	{
		const f:Closure = synchronous ? fin : () => deferImmediate(fin);
		this.doneNow(f, f);
		return this;
	}

}

export abstract class Resolvable<T>
	extends PromiseBase<T>
{

	doneNow(
		onFulfilled:(v?:T) => any,
		onRejected?:(v?:any) => any):void
	{
		this.throwIfDisposed();

		switch(this.state)
		{
			case TSDNPromise.State.Fulfilled:
				if(onFulfilled) onFulfilled(this._result);
				break;
			case TSDNPromise.State.Rejected:
				if(onRejected) onRejected(this._error);
				break;
		}
	}

	thenSynchronous<TFulfilled = T, TRejected = never>(
		onFulfilled:TSDNPromise.Fulfill<T, TFulfilled> | undefined | null,
		onRejected?:TSDNPromise.Reject<TRejected> | undefined | null):PromiseBase<TFulfilled | TRejected>
	{
		this.throwIfDisposed();

		try
		{
			switch(this.state)
			{
				case TSDNPromise.State.Fulfilled:
					return onFulfilled
						? resolve(this._result, onFulfilled, TSDNPromise.resolve)
						: <any>this; // Provided for catch cases.
				case TSDNPromise.State.Rejected:
					return onRejected
						? resolve(this._error, onRejected, TSDNPromise.resolve)
						: <any>this;
			}
		}
		catch(ex)
		{
			return new Rejected<any>(ex);
		}

		throw new Error("Invalid state for a resolved promise.");
	}



}

/**
 * The simplest usable version of a promise which returns synchronously the resolved state provided.
 */
export abstract class Resolved<T>
	extends Resolvable<T>
{
	constructor(state:TSDNPromise.State, result:T, error?:any)
	{
		super();
		this._result = result;
		this._error = error;
		this._state = state;
	}


}

/**
 * A fulfilled Resolved<T>.  Provided for readability.
 */
export class Fulfilled<T>
	extends Resolved<T>
{
	constructor(value:T)
	{
		super(TSDNPromise.State.Fulfilled, value);
	}
}

/**
 * A rejected Resolved<T>.  Provided for readability.
 */
export class Rejected<T>
	extends Resolved<T>
{
	constructor(error:any)
	{
		super(TSDNPromise.State.Rejected, VOID0, error);
	}
}


/**
 * Provided as a means for extending the interface of other PromiseLike<T> objects.
 */
class PromiseWrapper<T>
	extends Resolvable<T>
{
	constructor(private _target:PromiseLike<T>)
	{
		super();

		if(!_target)
			throw new ArgumentNullException(TARGET);

		if(!isPromise(_target))
			throw new ArgumentException(TARGET, "Must be a promise-like object.");

		_target.then(
			(v:T) =>
			{
				this._state = TSDNPromise.State.Fulfilled;
				this._result = v;
				this._error = VOID0;
				this._target = VOID0;
			},
			e =>
			{
				this._state = TSDNPromise.State.Rejected;
				this._error = e;
				this._target = VOID0;
			})
	}

	thenSynchronous<TFulfilled = T, TRejected = never>(
		onFulfilled:TSDNPromise.Fulfill<T, TFulfilled>,
		onRejected?:TSDNPromise.Reject<TRejected>):PromiseBase<TFulfilled | TRejected>
	{
		this.throwIfDisposed();

		let t = this._target;
		if(!t) return super.thenSynchronous(onFulfilled, onRejected);

		return new TSDNPromise<TFulfilled | TRejected>((resolve, reject) =>
		{
			handleDispatch(t,
				result => handleResolutionMethods(resolve, reject, result, onFulfilled),
				error => onRejected
					? handleResolutionMethods(resolve, null, error, onRejected)
					: reject(error)
			);
		}, true);
	}

	doneNow(
		onFulfilled:(v?:T) => any,
		onRejected?:(v?:any) => any):void
	{
		this.throwIfDisposed();

		let t = this._target;
		if(t)
			handleDispatch(t, onFulfilled, onRejected);
		else
			super.doneNow(onFulfilled, onRejected);
	}

	protected _onDispose():void
	{
		super._onDispose();
		this._target = VOID0;
	}

}


/**
 * This promise class that facilitates pending resolution.
 */
export class TSDNPromise<T>
	extends Resolvable<T>
{

	private _waiting:IPromiseCallbacks<any>[] | null | undefined;

	/*
	 * A note about deferring:
	 * The caller can set resolveImmediate to true if they intend to initialize code that will end up being deferred itself.
	 * This eliminates the extra defer that will occur internally.
	 * But for the most part, resolveImmediate = false (the default) will ensure the constructor will not block.
	 *
	 * resolveUsing allows for the same ability but does not defer by default: allowing the caller to take on the work load.
	 * If calling resolve or reject and a deferred response is desired, then use deferImmediate with a closure to do so.
	 */

	constructor(
		resolver?:TSDNPromise.Executor<T>, forceSynchronous:boolean = false)
	{
		super();

		if(resolver) this.resolveUsing(resolver, forceSynchronous);
	}

	thenSynchronous<TFulfilled = T, TRejected = never>(
		onFulfilled:TSDNPromise.Fulfill<T, TFulfilled> | undefined | null,
		onRejected?:TSDNPromise.Reject<TRejected> | undefined | null):PromiseBase<TFulfilled | TRejected>
	{
		this.throwIfDisposed();

		// Already fulfilled?
		if(this._state) return super.thenSynchronous(onFulfilled, onRejected);

		const p = new TSDNPromise<TFulfilled | TRejected>();
		(this._waiting || (this._waiting = []))
			.push(pools.PromiseCallbacks.init(onFulfilled, onRejected, p));
		return p;
	}

	doneNow(
		onFulfilled:(v?:T) => any,
		onRejected?:(v?:any) => any):void
	{
		this.throwIfDisposed();

		// Already fulfilled?
		if(this._state)
			return super.doneNow(onFulfilled, onRejected);

		(this._waiting || (this._waiting = []))
			.push(pools.PromiseCallbacks.init(onFulfilled, onRejected));
	}

	protected _onDispose()
	{
		super._onDispose();
		this._resolvedCalled = VOID0;
	}

	// Protects against double calling.
	protected _resolvedCalled:boolean;

	resolveUsing(
		resolver:TSDNPromise.Executor<T>,
		forceSynchronous:boolean = false):void
	{
		if(!resolver)
			throw new ArgumentNullException("resolver");
		if(this._resolvedCalled)
			throw new InvalidOperationException(".resolve() already called.");
		if(this.state)
			throw new InvalidOperationException("Already resolved: " + TSDNPromise.State[this.state]);

		this._resolvedCalled = true;

		let state = 0;
		const rejectHandler = (reason:any) =>
		{
			if(state)
			{
				// Someone else's promise handling down stream could double call this. :\
				console.warn(state== -1
					? "Rejection called multiple times"
					: "Rejection called after fulfilled.");
			}
			else
			{
				state = -1;
				this._resolvedCalled = false;
				this.reject(reason);
			}
		};

		const fulfillHandler = (v:any) =>
		{
			if(state)
			{
				// Someone else's promise handling down stream could double call this. :\
				console.warn(state==1
					? "Fulfill called multiple times"
					: "Fulfill called after rejection.");
			}
			else
			{
				state = 1;
				this._resolvedCalled = false;
				this.resolve(v);
			}
		};

		// There are some performance edge cases where there caller is not blocking upstream and does not need to defer.
		if(forceSynchronous)
			resolver(fulfillHandler, rejectHandler);
		else
			deferImmediate(() => resolver(fulfillHandler, rejectHandler));

	}


	private _emitDisposalRejection(p:PromiseBase<any>):boolean
	{
		const d = p.wasDisposed;
		if(d) this._rejectInternal(newODE());
		return d;
	}

	private _resolveInternal(result?:T | PromiseLike<T>):void
	{
		if(this.wasDisposed) return;

		// Note: Avoid recursion if possible.

		// Check ahead of time for resolution and resolve appropriately
		while(result instanceof PromiseBase)
		{
			let r:PromiseBase<T> = <any>result;
			if(this._emitDisposalRejection(r)) return;
			switch(r.state)
			{
				case TSDNPromise.State.Pending:
					r.doneNow(
						v => this._resolveInternal(v),
						e => this._rejectInternal(e)
					);
					return;
				case TSDNPromise.State.Rejected:
					this._rejectInternal(r.error);
					return;
				case TSDNPromise.State.Fulfilled:
					result = r.result;
					break;
			}
		}

		if(isPromise(result))
		{
			result.then(
				v => this._resolveInternal(v),
				e => this._rejectInternal(e)
			);
		}
		else
		{
			this._state = TSDNPromise.State.Fulfilled;

			this._result = result;
			this._error = VOID0;
			const o = this._waiting;
			if(o)
			{
				this._waiting = VOID0;
				for(let c of o)
				{
					let {onFulfilled, promise} = c;
					pools.PromiseCallbacks.recycle(c);
					//let ex =
					handleResolution(<any>promise, result, onFulfilled);
					//if(!p && ex) console.error("Unhandled exception in onFulfilled:",ex);
				}
				o.length = 0;
			}
		}
	}

	private _rejectInternal(error:any):void
	{

		if(this.wasDisposed) return;

		this._state = TSDNPromise.State.Rejected;

		this._error = error;
		const o = this._waiting;
		if(o)
		{
			this._waiting = null; // null = finished. undefined = hasn't started.
			for(let c of o)
			{
				let {onRejected, promise} = c;
				pools.PromiseCallbacks.recycle(c);
				if(onRejected)
				{
					//let ex =
					handleResolution(promise, error, onRejected);
					//if(!p && ex) console.error("Unhandled exception in onRejected:",ex);
				}
				else if(promise) { //noinspection JSIgnoredPromiseFromCall
					promise.reject(error);
				}
			}
			o.length = 0;
		}
	}

	resolve(result?:T | PromiseLike<T>, throwIfSettled:boolean = false):void
	{
		this.throwIfDisposed();
		if(<any>result==this)
			throw new InvalidOperationException("Cannot resolve a promise as itself.");

		if(this._state)
		{
			// Same value? Ignore...
			if(!throwIfSettled || this._state==TSDNPromise.State.Fulfilled && this._result===result) return;
			throw new InvalidOperationException("Changing the fulfilled state/value of a promise is not supported.");
		}

		if(this._resolvedCalled)
		{
			if(throwIfSettled)
				throw new InvalidOperationException(".resolve() already called.");
			return;
		}

		this._resolveInternal(result);
	}


	reject(error:any, throwIfSettled:boolean = false):void
	{
		this.throwIfDisposed();
		if(this._state)
		{
			// Same value? Ignore...
			if(!throwIfSettled || this._state==TSDNPromise.State.Rejected && this._error===error) return;
			throw new InvalidOperationException("Changing the rejected state/value of a promise is not supported.");
		}

		if(this._resolvedCalled)
		{
			if(throwIfSettled)
				throw new InvalidOperationException(".resolve() already called.");
			return;
		}

		this._rejectInternal(error);
	}
}


/**
 * By providing an ArrayPromise we expose useful methods/shortcuts for dealing with array results.
 */
export class ArrayPromise<T>
	extends TSDNPromise<T[]>
{

	/**
	 * Simplifies the use of a map function on an array of results when the source is assured to be an array.
	 * @param transform
	 * @returns {PromiseBase<Array<any>>}
	 */
	map<U>(transform:(value:T) => U):ArrayPromise<U>
	{
		this.throwIfDisposed();
		return new ArrayPromise<U>(resolve =>
		{
			this.doneNow((result:T[]) => resolve(result.map(transform)));
		}, true);
	}

	reduce(
		reduction:(previousValue:T, currentValue:T, i?:number, array?:T[]) => T,
		initialValue?:T):PromiseBase<T>

	reduce<U>(
		reduction:(previousValue:U, currentValue:T, i?:number, array?:T[]) => U,
		initialValue:U):PromiseBase<U>

	/**
	 * Simplifies the use of a reduce function on an array of results when the source is assured to be an array.
	 * @param reduction
	 * @param initialValue
	 * @returns {PromiseBase<any>}
	 */
	reduce<U>(
		reduction:(previousValue:U, currentValue:T, i?:number, array?:T[]) => U,
		initialValue?:U):PromiseBase<U>
	{

		return this
			.thenSynchronous((result:T[]) => result.reduce(reduction, <any>initialValue));
	}

	static fulfilled<T>(value:T[]):ArrayPromise<T>
	{
		return new ArrayPromise<T>(resolve => value, true);
	}
}

const PROMISE_COLLECTION = "PromiseCollection";
/**
 * A Promise collection exposes useful methods for handling a collection of promises and their results.
 */
export class PromiseCollection<T>
	extends DisposableBase
{
	private _source:PromiseLike<T>[];

	constructor(source:PromiseLike<T>[] | null | undefined)
	{
		super();
		this._disposableObjectName = PROMISE_COLLECTION;
		this._source = source && source.slice() || [];
	}

	protected _onDispose()
	{
		super._onDispose();
		this._source.length = 0;
		(<any>this)._source = null;
	}

	/**
	 * Returns a copy of the source promises.
	 * @returns {PromiseLike<PromiseLike<any>>[]}
	 */
	get promises():PromiseLike<T>[]
	{
		this.throwIfDisposed();
		return this._source.slice();
	}

	/**
	 * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
	 * @returns {PromiseBase<any>}
	 */
	all():ArrayPromise<T>
	{
		this.throwIfDisposed();
		return TSDNPromise.all(this._source);
	}

	/**
	 * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
	 * or rejected.
	 * @returns {PromiseBase<any>} A new Promise.
	 */
	race():PromiseBase<T>
	{
		this.throwIfDisposed();
		return TSDNPromise.race(this._source);
	}

	/**
	 * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
	 * Unlike .all this method waits for all rejections as well as fulfillment.
	 * @returns {PromiseBase<PromiseLike<any>[]>}
	 */
	waitAll():ArrayPromise<PromiseLike<T>>
	{
		this.throwIfDisposed();
		return TSDNPromise.waitAll(this._source);
	}

	/**
	 * Waits for all the values to resolve and then applies a transform.
	 * @param transform
	 * @returns {PromiseBase<Array<any>>}
	 */
	map<U>(transform:(value:T) => U):ArrayPromise<U>
	{
		this.throwIfDisposed();
		return new ArrayPromise<U>(resolve =>
		{
			this.all()
				.doneNow((result:T[]) => resolve(result.map(transform)));
		}, true);
	}

	/**
	 * Applies a transform to each promise and defers the result.
	 * Unlike map, this doesn't wait for all promises to resolve, ultimately improving the async nature of the request.
	 * @param transform
	 * @returns {PromiseCollection<U>}
	 */

	pipe<U>(transform:(value:T) => U | PromiseLike<U>):PromiseCollection<U>
	{
		this.throwIfDisposed();
		return new PromiseCollection<U>(
			this._source.map(p => handleSyncIfPossible(p, transform))
		);
	}

	reduce(
		reduction:(previousValue:T, currentValue:T, i?:number, array?:PromiseLike<T>[]) => T,
		initialValue?:T | PromiseLike<T>):PromiseBase<T>

	reduce<U>(
		reduction:(previousValue:U, currentValue:T, i?:number, array?:PromiseLike<T>[]) => U,
		initialValue:U | PromiseLike<U>):PromiseBase<U>

	/**
	 * Behaves like array reduce.
	 * Creates the promise chain necessary to produce the desired result.
	 * @param reduction
	 * @param initialValue
	 * @returns {PromiseBase<PromiseLike<any>>}
	 */
	reduce<U>(
		reduction:(previousValue:U, currentValue:T, i?:number, array?:PromiseLike<T>[]) => U,
		initialValue?:U | PromiseLike<U>):PromiseBase<U>
	{
		this.throwIfDisposed();
		return TSDNPromise.wrap<U>(this._source
			.reduce(
				(
					previous:PromiseLike<U>,
					current:PromiseLike<T>,
					i:number,
					array:PromiseLike<T>[]) =>
					handleSyncIfPossible(previous,
						(p:U) => handleSyncIfPossible(current, (c:T) => reduction(p, c, i, array))),

					isPromise(initialValue)
						? initialValue
						: new Fulfilled(<any>initialValue)
			)
		);
	}
}

module pools
{

	// export module pending
	// {
	//
	//
	// 	var pool:ObjectPool<Promise<any>>;
	//
	// 	function getPool()
	// 	{
	// 		return pool || (pool = new ObjectPool<Promise<any>>(40, factory, c=>c.dispose()));
	// 	}
	//
	// 	function factory():Promise<any>
	// 	{
	// 		return new Promise();
	// 	}
	//
	// 	export function get():Promise<any>
	// 	{
	// 		var p:any = getPool().take();
	// 		p.__wasDisposed = false;
	// 		p._state = Promise.State.Pending;
	// 		return p;
	// 	}
	//
	// 	export function recycle<T>(c:Promise<T>):void
	// 	{
	// 		if(c) getPool().add(c);
	// 	}
	//
	// }
	//
	// export function recycle<T>(c:PromiseBase<T>):void
	// {
	// 	if(!c) return;
	// 	if(c instanceof Promise && c.constructor==Promise) pending.recycle(c);
	// 	else c.dispose();
	// }


	export module PromiseCallbacks
	{

		let pool:ObjectPool<IPromiseCallbacks<any>>;

		//noinspection JSUnusedLocalSymbols
		function getPool()
		{
			return pool
				|| (pool = new ObjectPool<IPromiseCallbacks<any>>(40, factory, c =>
				{
					c.onFulfilled = NULL;
					c.onRejected = NULL;
					c.promise = NULL;
				}));
		}

		function factory():IPromiseCallbacks<any>
		{
			return {
				onFulfilled: NULL,
				onRejected: NULL,
				promise: NULL
			}
		}

		export function init<T>(
			onFulfilled:TSDNPromise.Fulfill<T, any> | undefined | null,
			onRejected?:TSDNPromise.Reject<any> | undefined | null,
			promise?:TSDNPromise<any>):IPromiseCallbacks<T>
		{

			const c = getPool().take();
			c.onFulfilled = onFulfilled || undefined;
			c.onRejected = onRejected || undefined;
			c.promise = promise;
			return c;
		}

		export function recycle<T>(c:IPromiseCallbacks<T>):void
		{
			getPool().add(c);
		}
	}


}


export module TSDNPromise
{

	/**
	 * The state of a promise.
	 * https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md
	 * If a promise is disposed the value will be undefined which will also evaluate (promise.state)==false.
	 */
	export enum State {
		Pending = 0,
		Fulfilled = 1,
		Rejected = -1
	}
	Object.freeze(State);

	export type Resolution<TResult> = TResult | PromiseLike<TResult>;

	export interface Fulfill<T, TResult>
	{
		(value:T):Resolution<TResult>
	}

	export interface Reject<TResult>
	{
		(reason:any):TResult | PromiseLike<TResult>;
	}

	export interface Then<T, TResult>
	{
		(onfulfilled?:Fulfill<T, TResult> | undefined | null, onrejected?:Reject<TResult> | undefined | null):PromiseLike<TResult>;
		(onfulfilled?:Fulfill<T, TResult> | undefined | null, onrejected?:Reject<void> | undefined | null):PromiseLike<TResult>;
	}

	export interface Executor<T>
	{
		(
			resolve:(value?:T | PromiseLike<T>) => void,
			reject:(reason?:any) => void):void;
	}

	//noinspection JSUnusedGlobalSymbols
	export interface Factory
	{
		<T>(executor:Executor<T>):PromiseLike<T>;
	}

	export function factory<T>(e:Executor<T>):TSDNPromise<T>
	{
		return new TSDNPromise(e);
	}

	/**
	 * Takes a set of promises and returns a PromiseCollection.
	 * @param promises
	 */
	export function group<T>(promises:PromiseLike<T>[]):PromiseCollection<T>
	export function group<T>(
		promise:PromiseLike<T>,
		...rest:PromiseLike<T>[]):PromiseCollection<T>
	export function group(
		first:PromiseLike<any> | PromiseLike<any>[],
		...rest:PromiseLike<any>[]):PromiseCollection<any>
	{

		if(!first && !rest.length) throw new ArgumentNullException("promises");
		return new PromiseCollection(
			((first) instanceof (Array) ? first : [first])
				.concat(rest)
		);
	}

	/**
	 * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
	 */
	export function all<T>(promises:PromiseLike<T>[]):ArrayPromise<T>
	export function all<T>(promise:PromiseLike<T>, ...rest:PromiseLike<T>[]):ArrayPromise<T>
	export function all(
		first:PromiseLike<any> | PromiseLike<any>[],
		...rest:PromiseLike<any>[]):ArrayPromise<any>
	{
		if(!first && !rest.length) throw new ArgumentNullException("promises");
		let promises = ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy!
		if(!promises.length || promises.every(v => !v)) return new ArrayPromise<any>(
			r => r(promises), true); // it's a new empty, reuse it. :|

		// Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
		return new ArrayPromise<any>((resolve, reject) =>
		{
			let result:any[] = [];
			let len = promises.length;
			result.length = len;
			// Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
			let remaining = new Set(promises.map((v, i) => i)); // get all the indexes...

			let cleanup = () =>
			{
				reject = VOID0;
				resolve = VOID0;
				promises.length = 0;
				promises = VOID0;
				remaining.dispose();
				remaining = VOID0;
			};

			let checkIfShouldResolve = () =>
			{
				let r = resolve;
				if(r && !remaining.count)
				{
					cleanup();
					r(result);
				}
			};

			let onFulfill = (v:any, i:number) =>
			{
				if(resolve)
				{
					result[i] = v;
					remaining.remove(i);
					checkIfShouldResolve();
				}
			};

			let onReject = (e?:any) =>
			{
				let r = reject;
				if(r)
				{
					cleanup();
					r(e);
				}
			};

			for(let i = 0; remaining && i<len; i++)
			{
				let p = promises[i];
				if(p) p.then(v => onFulfill(v, i), onReject);
				else remaining.remove(i);
				checkIfShouldResolve();
			}
		});
	}

	/**
	 * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
	 * Unlike .all this method waits for all rejections as well as fulfillment.
	 */
	export function waitAll<T>(promises:PromiseLike<T>[]):ArrayPromise<PromiseLike<T>>
	export function waitAll<T>(
		promise:PromiseLike<T>,
		...rest:PromiseLike<T>[]):ArrayPromise<PromiseLike<T>>
	export function waitAll(
		first:PromiseLike<any> | PromiseLike<any>[],
		...rest:PromiseLike<any>[]):ArrayPromise<PromiseLike<any>>
	{
		if(!first && !rest.length) throw new ArgumentNullException("promises");
		const promises = ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy!
		if(!promises.length || promises.every(v => !v)) return new ArrayPromise<any>(
			r => r(promises), true); // it's a new empty, reuse it. :|


		// Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
		return new ArrayPromise<any>((resolve, reject) =>
		{
			let len = promises.length;

			// Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
			let remaining = new Set(promises.map((v, i) => i)); // get all the indexes...

			let cleanup = () =>
			{
				reject = NULL;
				resolve = NULL;
				remaining.dispose();
				remaining = NULL;
			};

			let checkIfShouldResolve = () =>
			{
				let r = resolve;
				if(r && !remaining.count)
				{
					cleanup();
					r(promises);
				}
			};

			let onResolved = (i:number) =>
			{
				if(remaining)
				{
					remaining.remove(i);
					checkIfShouldResolve();
				}
			};

			for(let i = 0; remaining && i<len; i++)
			{
				let p = promises[i];
				if(p) p.then(v => onResolved(i), e => onResolved(i));
				else onResolved(i);
			}
		});

	}

	/**
	 * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
	 * or rejected.
	 * @param promises An array of Promises.
	 * @returns A new Promise.
	 */
	export function race<T>(promises:PromiseLike<T>[]):PromiseBase<T>
	export function race<T>(promise:PromiseLike<T>, ...rest:PromiseLike<T>[]):PromiseBase<T>
	export function race(
		first:PromiseLike<any> | PromiseLike<any>[],
		...rest:PromiseLike<any>[]):PromiseBase<any>
	{
		let promises = first && ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy?
		if(!promises || !promises.length || !(promises = promises.filter(v => v!=null)).length)
			throw new ArgumentException("Nothing to wait for.");

		const len = promises.length;

		// Only one?  Nothing to race.
		if(len==1) return wrap(promises[0]);

		// Look for already resolved promises and the first one wins.
		for(let i = 0; i<len; i++)
		{
			const p:any = promises[i];
			if(p instanceof PromiseBase && p.isSettled) return p;
		}

		return new TSDNPromise((resolve, reject) =>
		{
			let cleanup = () =>
			{
				reject = NULL;
				resolve = NULL;
				promises.length = 0;
				promises = NULL;
			};

			let onResolve = (r:(x:any) => void, v:any) =>
			{
				if(r)
				{
					cleanup();
					r(v);
				}
			};

			let onFulfill = (v:any) => onResolve(resolve, v);
			let onReject = (e?:any) => onResolve(reject, e);

			for(let p of promises)
			{
				if(!resolve) break;
				p.then(onFulfill, onReject);
			}
		});
	}

	// // race<T>(values: Iterable<T | PromiseLike<T>>): Promise<T>;

	/**
	 * Creates a new resolved promise .
	 * @returns A resolved promise.
	 */
	export function resolve():PromiseBase<void>

	/**
	 * Creates a new resolved promise for the provided value.
	 * @param value A value or promise.
	 * @returns A promise whose internal state matches the provided promise.
	 */
	export function resolve<T>(value:T | PromiseLike<T>):PromiseBase<T>;
	export function resolve(value?:any):PromiseBase<any>
	{

		return isPromise(value) ? wrap(value) : new Fulfilled(value);
	}

	/**
	 * Syntactic shortcut for avoiding 'new'.
	 * @param resolver
	 * @param forceSynchronous
	 * @returns {TSDNPromise}
	 */
	export function using<T>(
		resolver:TSDNPromise.Executor<T>,
		forceSynchronous:boolean = false):PromiseBase<T>
	{
		return new TSDNPromise<T>(resolver, forceSynchronous);
	}

	/**
	 * Takes a set of values or promises and returns a PromiseCollection.
	 * Similar to 'group' but calls resolve on each entry.
	 * @param resolutions
	 */
	export function resolveAll<T>(resolutions:Array<T | PromiseLike<T>>):PromiseCollection<T>;
	export function resolveAll<T>(
		promise:T | PromiseLike<T>,
		...rest:Array<T | PromiseLike<T>>):PromiseCollection<T>
	export function resolveAll(
		first:any | PromiseLike<any> | Array<any | PromiseLike<any>>,
		...rest:Array<any | PromiseLike<any>>):PromiseCollection<any>
	{
		if(!first && !rest.length) throw new ArgumentNullException("resolutions");
		return new PromiseCollection(
			((first) instanceof (Array) ? first : [first])
				.concat(rest)
				.map((v:any) => resolve(v)));
	}

	/**
	 * Creates a PromiseCollection containing promises that will resolve on the next tick using the transform function.
	 * This utility function does not chain promises together to create the result,
	 * it only uses one promise per transform.
	 * @param source
	 * @param transform
	 * @returns {PromiseCollection<T>}
	 */
	export function map<T, U>(source:T[], transform:(value:T) => U):PromiseCollection<U>
	{
		return new PromiseCollection<U>(
			source.map(d => new TSDNPromise<U>((r, j) =>
			{
				try
				{
					r(transform(d));
				}
				catch(ex)
				{
					j(ex);
				}
			}))
		);
	}

	/**
	 * Creates a new rejected promise for the provided reason.
	 * @param reason The reason the promise was rejected.
	 * @returns A new rejected Promise.
	 */
	export function reject<T>(reason:T):PromiseBase<T>
	{
		return new Rejected<T>(reason);
	}

	/**
	 * Takes any Promise-Like object and ensures an extended version of it from this module.
	 * @param target The Promise-Like object
	 * @returns A new target that simply extends the target.
	 */
	export function wrap<T>(target:T | PromiseLike<T>):PromiseBase<T>
	{
		if(!target) throw new ArgumentNullException(TARGET);
		return isPromise(target)
			? (target instanceof PromiseBase ? target : new PromiseWrapper(target))
			: new Fulfilled<T>(target);
	}

	/**
	 * A function that acts like a 'then' method (aka then-able) can be extended by providing a function that takes an onFulfill and onReject.
	 * @param then
	 * @returns {PromiseWrapper<T>}
	 */
	export function createFrom<T>(then:Then<T, any>):PromiseBase<T>
	{
		if(!then) throw new ArgumentNullException(THEN);
		return new PromiseWrapper<T>({then: then});
	}

}


interface IPromiseCallbacks<T>
{
	onFulfilled?:TSDNPromise.Fulfill<T, any>;
	onRejected?:TSDNPromise.Reject<any>;
	promise?:TSDNPromise<any>;
}

export {TSDNPromise as Promise};

export default TSDNPromise;


