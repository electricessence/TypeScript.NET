/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Type} from "../Types";
import {IDisposable} from "./IDisposable";

/**
 * Takes any number of disposables as arguments and attempts to dispose them.
 * Any exceptions thrown within a dispose are not trapped.
 * Use 'disposeWithoutException' to automatically trap exceptions.
 *
 * Can accept <any> and will ignore objects that don't have a dispose() method.
 * @param disposables
 */
export function dispose(...disposables:IDisposable[]):void
{
	// The disposables arguments array is effectively localized so it's safe.
	disposeTheseInternal(disposables, false);
}

export module dispose {

	export function deferred(...disposables:IDisposable[]):void {
		these.deferred(disposables);
	}


	/**
	 * Takes any number of disposables and traps any errors that occur when disposing.
	 * Returns an array of the exceptions thrown.
	 * @param disposables
	 * @returns {any[]} Returns an array of exceptions that occurred, if there are any.
	 */
	export function withoutException(...disposables:IDisposable[]):any[]
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
	export function these(disposables:IDisposable[], trapExceptions?:boolean):any[]
	{
		return disposables && disposables.length
			? disposeTheseInternal(disposables.slice(), trapExceptions)
			: null;
	}

	export module these {
		export function deferred(disposables:IDisposable[], delay:number = 0):void {
			if(disposables && disposables.length) {
				if(!(delay>=0)) delay = 0;
				setTimeout(disposeTheseInternal,delay,disposables.slice(), true);
			}
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
	if(disposable && Type.of(disposable).member('dispose').isFunction)
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
 * This dispose method assumes it's working on a local copy and is unsafe for external use.
 */
function disposeTheseInternal(
	disposables:IDisposable[],
	trapExceptions:boolean,
	index:number = 0):any[]
{
	var exceptions:any[];
	var len = disposables.length;

	for(; index<len; index++)
	{
		var next = disposables[index];
		if(!next) continue;
		if(trapExceptions)
		{
			var ex = disposeSingle(next, true);
			if(ex)
			{
				if(!exceptions) exceptions = [];
				exceptions.push(ex);
			}
		}
		else
		{
			var success = false;
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