/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
import { IDisposable } from "../Disposable/IDisposable";
export declare class SubscribableBase<TSubscriber> implements IDisposable {
    private __subscriptions;
    protected _getSubscribers(): TSubscriber[];
    constructor();
    private _findEntryNode(subscriber);
    subscribe(subscriber: TSubscriber): IDisposable;
    unsubscribe(subscriber: TSubscriber): void;
    protected _unsubscribeAll(returnSubscribers?: boolean): TSubscriber[];
    unsubscribeAll(): void;
    dispose(): void;
}
export default SubscribableBase;
