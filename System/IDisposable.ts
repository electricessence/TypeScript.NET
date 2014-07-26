/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System {

	export interface IDisposable {
		dispose(): void;
		wasDisposed: boolean;
	}

	export class DisposableBase implements IDisposable {

		_wasDisposed: boolean = false;
		get wasDisposed(): boolean {
			return this._wasDisposed;
		}

		dispose(): void {
			if (!this._wasDisposed) {
				// Premtively set wasDisposed in order to prevent repeated disposing.
				// NOTE: in true multithreaded scenarios, this needs to be synchronized.
				this._wasDisposed = true;
				this._onDispose();
			}
		}

		// Marked public so it can be overriden but is not intended for public use.
		// Override this to handle destruction...
		// Be sure to call super._onDestroy() in deeper sub classes...
		_onDispose():void {
		}

	}
}
