/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {PromiseBase, TSDNPromise} from "./Promise";
import {Closure} from "../FunctionTypes";
import {ICancellable} from "../Threading/ICancellable";
import {defer} from "../Threading/defer";
import {ArgumentNullException} from "../Exceptions/ArgumentNullException";
import __extendsImport from "../../extends";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

const VOID0:any = void 0;

/**
 * A promise that waits for the first then to trigger the resolver.
 */
export class LazyPromise<T> extends TSDNPromise<T>
{

	constructor(private _resolver:TSDNPromise.Executor<T>)
	{
		super();
		if(!_resolver) throw new ArgumentNullException("resolver");
		this._resolvedCalled = true;
	}

	protected _onDispose():void
	{
		super._onDispose();
		this._resolver = VOID0;
	}

	private _onThen():void
	{
		const r = this._resolver;
		if(r)
		{
			this._resolver = VOID0;
			this._resolvedCalled = false;
			this.resolveUsing(r);
		}
	}

	thenSynchronous<TResult>(
		onFulfilled:TSDNPromise.Fulfill<T, TResult>,
		onRejected?:TSDNPromise.Reject<TResult>):PromiseBase<TResult>
	{
		this._onThen();
		return super.thenSynchronous(onFulfilled, onRejected);
	}


	doneNow(
		onFulfilled:(v?:T)=>any,
		onRejected?:(v?:any)=>any):void
	{
		this._onThen();
		super.doneNow(onFulfilled, onRejected);
	}

	// NOTE: For a LazyPromise we need to be careful not to trigger the resolve for delay.

	/**
	 * Will yield for a number of milliseconds from the time called before continuing.
	 * @param milliseconds
	 * @returns A promise that yields to the current execution and executes after a minimum delay.
	 */
	delayFromNow(milliseconds:number = 0):PromiseBase<T>
	{
		this.throwIfDisposed();

		// If this is already guaranteed to resolve, the go ahead and pass to the super.
		if(!this._resolver || this.isSettled)
			return super.delayFromNow(milliseconds);

		/*
		 * If not triggered yet, then we create a special promise
		 * that only requests the resolution from the parent promise
		 * if a 'then' is called to ensure the lazy pattern.
		 */
		let pass:Closure;
		let timedOut:boolean = false;

		// Setup the timer.
		let timeout = defer(() =>
			{
				timedOut = true;
				// If the promise was requested already go ahead and pass the request on to the parent.
				if(pass)
					pass();
			},
			milliseconds);

		return new LazyPromise<T>(
			(resolve, reject)=>
			{
				// A lazy promise only enters here if something called for a resolution.
				pass = ()=>
				{
					this.doneNow(
						v=> resolve(v),
						e=> reject(e)
					);
					timeout.dispose();
					timeout = VOID0;
					pass = VOID0;
				};

				// If the timeout completed already go ahead and pass the request on to the parent.
				if(timedOut)
					pass();
				// Otherwise wait for the timeout to do it.
			});
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

		// If this is already guaranteed to resolve, the go ahead and pass to the super.
		if(!this._resolver || this.isSettled)
			return super.delayAfterResolve(milliseconds);

		/*
		 * If not triggered yet, then we create a special promise
		 * that only requests the resolution from the parent promise
		 * if a 'then' is called to ensure the lazy pattern.
		 */
		let pass:Closure;


		// Setup the timer.
		let timeout:ICancellable;

		let finalize = () =>
		{
			if(timeout)
			{
				timeout.dispose();
				timeout = VOID0;
			}
			// If the promise was requested already go ahead and pass the request on to the parent.
			if(pass)
				pass();

			finalize = VOID0;
		};

		{
			let detector = ()=>
			{
				if(finalize) // We may already be wrapped up so never mind!
					timeout = defer(finalize, milliseconds);
			};

			// Calling super.doneNow does not trigger resolution.
			// This simply waits for resolution to happen.
			// Is effectively the timer by when resolution has occurred.
			super.doneNow(detector, detector);
			//noinspection JSUnusedAssignment
			detector = <any>null;
		}

		return new LazyPromise<T>(
			(resolve, reject)=>
			{
				// Because of the lazy nature of this promise, this could enter here at any time.
				if(this.isPending)
				{
					this.doneNow(
						v=> defer(()=>resolve(v), milliseconds),
						e=> defer(()=>reject(e), milliseconds)
					);
					finalize();
				}
				else
				{
					// We don't know when this resolved and could have happened anytime after calling this delay method.
					pass = ()=>
					{
						this.doneNow(
							v=> resolve(v),
							e=> reject(e)
						);
					};

					// Already finalized (aka resolved after a timeout)? Go now!
					if(!finalize)
						pass();
				}

			});

	}
}

export default LazyPromise;