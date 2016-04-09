/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../Disposable/IDisposable.d.ts"/>
///<reference path="IEventListener.d.ts"/>

interface IEventDispatcher extends IDisposable {
	addEventListener(type: string, listener: IEventListener):void;
	dispatchEvent(event: Event): boolean;
	hasEventListener(type: string): boolean;
	removeEventListener(type: string, listener: IEventListener): void;
}
