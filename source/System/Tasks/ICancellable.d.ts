/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../Disposable/IDisposable.d.ts"/>

interface ICancellable extends IDisposable {

	/**
	 * Returns true if cancelled.
	 * Returns false if already run or already cancelled or unable to cancel.
 	 */
	cancel():boolean;
}