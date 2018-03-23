/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import IDisposable from "./IDisposable";
import TypeOfValue from "../Reflection/TypeOfValue";

// Allows for more flexible parameters.
export type DisposableItem = IDisposable|null|undefined;
export type DisposableItemArray = Array<DisposableItem>|null|undefined;

/**
 * Takes any number of disposables as arguments and attempts to dispose them.
 * Any exceptions thrown within a dispose are not trapped.
 * Use 'disposeWithoutException' to automatically trap exceptions.
 *
 * Can accept <any> and will ignore objects that don't have a dispose() method.
 * @param disposables
 */
function dispose(...disposables:DisposableItem[]):void
{
	// The disposables arguments array is effectively localized so it's safe.
	disposeTheseInternal(disposables, false);
}

module dispose
{

	/**
	 * Use this when only disposing one object to avoid creation of arrays.
	 * @param disposable
	 * @param trapExceptions
	 */
	export function single(disposable:DisposableItem, trapExceptions:boolean = false):void
	{
		if(disposable)
			disposeSingle(disposable,trapExceptions);
	}

	export function deferred(...disposables:DisposableItem[]):void
	{
		these.deferred(disposables);
	}


	/**
	 * Takes any number of disposables and traps any errors that occur when disposing.
	 * Returns an array of the exceptions thrown.
	 * @param disposables
	 * @returns {any[]} Returns an array of exceptions that occurred, if there are any.
	 */
	export function withoutException(...disposables:DisposableItem[]):any[]|undefined
	{
		// The disposables arguments array is effectively localized so it's safe.
		return disposeTheseInternal(disposables, true);
	}

	/**
	 * Takes an array of disposable objects and ensures they are disposed.
	 * @param disposables
	 * @param trapExceptions If true, prevents exceptions from being thrown when disposing.
	 * @returns {any[]} If 'trapExceptions' is true, returns an array of exceptions that occurred, if there are any.
	 */
	export function these(disposables:DisposableItemArray, trapExceptions?:boolean):any[]|undefined
	{
		return disposables && disposables.length
			? disposeTheseInternal(disposables.slice(), trapExceptions)
			: void 0;
	}

	export module these
	{
		export function deferred(disposables:DisposableItemArray, delay:number = 0):void
		{
			if(disposables && disposables.length)
			{
				if(!(delay>=0)) delay = 0;
				setTimeout(disposeTheseInternal, delay, disposables.slice(), true);
			}
		}

		/**
		 * Use this unsafe method when guaranteed not to cause events that will make modifications to the disposables array.
		 * @param disposables
		 * @param trapExceptions
		 * @returns {any[]}
		 */
		export function noCopy(disposables:DisposableItemArray, trapExceptions?:boolean):any[]|undefined
		{
			return disposables && disposables.length
				? disposeTheseInternal(disposables, trapExceptions)
				: void 0;
		}
	}

}

/**
 * Just like in C# this 'using' function will ensure the passed disposable is disposed when the closure has finished.
 *
 * Usage:
 * ```typescript
 * using(new DisposableObject(),(myObj)=>{
     *   // do work with myObj
     * });
 * // myObj automatically has it's dispose method called.
 * ```
 *
 * @param disposable Object to be disposed.
 * @param closure Function call to execute.
 * @returns {TReturn} Returns whatever the closure's return value is.
 */
export function using<TDisposable extends IDisposable,TReturn>(
	disposable:TDisposable,
	closure:(disposable:TDisposable) => TReturn):TReturn
{
	try
	{
		return closure(disposable);
	}
	finally
	{
		disposeSingle(disposable, false);
	}
}


/**
 * This private function makes disposing more robust for when there's no type checking.
 * If trapExceptions is 'true' it catches and returns any exception instead of throwing.
 */
function disposeSingle(
	disposable:IDisposable,
	trapExceptions:boolean):any
{
	if(
		disposable
		&& typeof disposable==TypeOfValue.Object
		&& typeof disposable['dispose'] == "function"
	)
	{
		if(trapExceptions)
		{
			try
			{
				disposable.dispose();
			}
			catch(ex)
			{
				return ex;
			}
		}
		else
			disposable.dispose();
	}

	return null;
}

/**
 * This dispose method assumes it's working on a local arrayCopy and is unsafe for external use.
 */
function disposeTheseInternal(
	disposables:DisposableItemArray,
	trapExceptions?:boolean,
	index:number = 0):any[]|undefined
{
	let exceptions:any[]|undefined;
	const len = disposables ? disposables.length : 0;

	for(; index<len; index++)
	{
		let next = disposables![index];
		if(!next) continue;
		if(trapExceptions)
		{
			const ex = disposeSingle(next, true);
			if(ex)
			{
				if(!exceptions) exceptions = [];
				exceptions.push(ex);
			}
		}
		else
		{
			let success = false;
			try
			{
				disposeSingle(next, false);
				success = true;
			}
				// Don't trap the exception in order to allow it to propagate the stack trace.
			finally
			{
				if(!success && index + 1<len)
				{
					/* If code is 'continued' by the debugger,
					 * need to ensure the rest of the disposables are cared for. */
					disposeTheseInternal(disposables, false, index + 1);
				}
			}
			// Just in case...  Should never happen, but asserts the intention.
			if(!success) break;
		}
	}

	return exceptions;
}

export default dispose;