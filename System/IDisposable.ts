/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System {

	export function dispose(...disposables: IDisposable[]): void
	{
		disposeTheseInternal(disposables, false);
	}

	export function disposeWithoutException(...disposables: IDisposable[]): void
	{
		disposeTheseInternal(disposables, true);
	}
	
	// Using this function will make it more robust when there's no type checking.
	function disposeSingle(disposable: IDisposable, ignoreExceptions: boolean): void
	{
		if (disposable && typeof disposable.dispose == Types.Function)
		{
			if (ignoreExceptions)
			{
				try
				{
					disposable.dispose();
				}
				catch (ex)
				{
					// Ignoring...
				}
			}
			else
				disposable.dispose();
		}
	}

	function disposeTheseInternal(disposables: IDisposable[], ignoreExceptions:boolean): void
	{
		var next: IDisposable;
		// Get the next non-null entry.
		while(disposables.length && !(next = disposables.shift())) { }
		if (next)
		{
			try
			{
				disposeSingle(next, ignoreExceptions);
			}
			finally
			{
				disposeTheseInternal(disposables, ignoreExceptions);
			}
		}
	}

	export function disposeThese(disposables: IDisposable[], ignoreExceptions?: boolean): void
	{
		if(disposables && disposables.length)
			disposeTheseInternal(disposables.slice(),ignoreExceptions);
	}

	export function using<TDisposable extends IDisposable,TReturn>(
		disposable: TDisposable,
		closure: (disposable: TDisposable) => TReturn): TReturn
	{
		try {
			return closure(disposable);
		}
		finally {
			dispose(disposable);
		}
	}

	// Allows for simple type checking that includes types that don't delare themselves as IDisposable but do have a dispose() method.
	export interface IDisposable {
		dispose(): void;
	}

	export interface IDisposableAware extends IDisposable
	{
		wasDisposed: boolean;
	}

	export class DisposableBase implements IDisposableAware {

		constructor(private _finalizer?: () => void) {
		}

		_wasDisposed: boolean = false;
		get wasDisposed(): boolean {
			return this._wasDisposed;
		}

		 	// This allows for the use of a boolean instead of calling this.assertIsNotDisposed() since there is a strong chance of introducing a circular reference.
		static assertIsNotDisposed(disposed:boolean, errorMessage: string = "ObjectDisposedException"): boolean {
			if (disposed)
				throw new Error(errorMessage);

			return true;
		}

		assertIsNotDisposed(errorMessage: string = "ObjectDisposedException"): boolean {
			return DisposableBase.assertIsNotDisposed(this._wasDisposed, errorMessage);
		}


		dispose(): void {
			var _ = this;
			if (!_._wasDisposed) {
				// Premtively set wasDisposed in order to prevent repeated disposing.
				// NOTE: in true multithreaded scenarios, this needs to be synchronized.
				_._wasDisposed = true;
				try {
					_._onDispose(); // Protected override.
				} finally {
					if (_._finalizer) // Private finalizer...
						_._finalizer();
				}
			}
		}

		// Marked public so it can be overriden but is not intended for public use.
		// Override this to handle destruction...
		// Be sure to call super._onDestroy() in deeper sub classes...
		_onDispose(): void {
		}

	}
}
