/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../Disposable/IDisposable.ts"/>

interface ISubscribable<TSubscriber> extends IDisposable
{
	subscribe(observer: TSubscriber): IDisposable;
	unsubscribe(observer: TSubscriber): void;
}
