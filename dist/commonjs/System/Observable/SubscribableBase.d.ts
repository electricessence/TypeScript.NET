/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
import { IDisposable } from "../Disposable/IDisposable";
import { DisposableBase } from "../Disposable/DisposableBase";
export declare class SubscribableBase<TSubscriber> extends DisposableBase {
    private __subscriptions;
    protected _getSubscribers(): TSubscriber[] | null;
    constructor();
    private _findEntryNode;
    subscribe(subscriber: TSubscriber): IDisposable;
    unsubscribe(subscriber: TSubscriber): void;
    protected _unsubscribeAll(): null;
    protected _unsubscribeAll(returnSubscribers: false): null;
    protected _unsubscribeAll(returnSubscribers: true): TSubscriber[] | null;
    protected _unsubscribeAll(returnSubscribers: boolean): TSubscriber[] | null;
    unsubscribeAll(): void;
    protected _onDispose(): void;
}
export default SubscribableBase;
