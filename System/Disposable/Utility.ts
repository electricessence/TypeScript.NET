///<reference path="IDisposable.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


import Types = require('Types');

/// Disposable Utility
module Utility {

	export function dispose(...disposables:IDisposable[]):void
	{
		disposeTheseInternal(disposables, false);
	}

	export function disposeWithoutException(...disposables:IDisposable[]):void
	{
		disposeTheseInternal(disposables, true);
	}

	// Using this function will make it more robust when there's no type checking.
	function disposeSingle(disposable:IDisposable, ignoreExceptions:boolean):void
	{
		if(disposable && typeof disposable.dispose==Types.Function) {
			if(ignoreExceptions) {
				try {
					disposable.dispose();
				}
				catch(ex) {
					// Ignoring...
				}
			}
			else
				disposable.dispose();
		}
	}

	function disposeTheseInternal(disposables:IDisposable[], ignoreExceptions:boolean):void
	{
		var next:IDisposable;
		// Get the next non-null entry.
		while(disposables.length && !(next = disposables.shift())) { } // TODO: avoid .shift()
		if(next) {
			try {
				disposeSingle(next, ignoreExceptions);
			}
			finally {
				disposeTheseInternal(disposables, ignoreExceptions);
			}
		}
	}

	export function disposeThese(disposables:IDisposable[], ignoreExceptions?:boolean):void
	{
		if(disposables && disposables.length)
			disposeTheseInternal(disposables.slice(0), ignoreExceptions);
	}

	export function using<TDisposable extends IDisposable,TReturn>(
		disposable:TDisposable,
		closure:(disposable:TDisposable) => TReturn):TReturn
	{
		try {
			return closure(disposable);
		}
		finally {
			dispose(disposable);
		}
	}

}

export = Utility;