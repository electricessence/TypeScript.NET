/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System {

	export function dispose(obj: any) {
		if (obj && typeof obj.dispose == Types.Function) obj.dispose();
	}

	export function using<TDisposable,TReturn>(
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

	export interface IDisposable {
		dispose(): void;
		wasDisposed: boolean;
	}

	export class DisposableBase implements IDisposable {

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
