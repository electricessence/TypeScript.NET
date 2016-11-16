import { IDisposable } from "../Disposable/IDisposable";
import { DisposableBase } from "../Disposable/DisposableBase";
export declare class SubscribableBase<TSubscriber> extends DisposableBase {
    private __subscriptions;
    protected _getSubscribers(): TSubscriber[] | null;
    constructor();
    private _findEntryNode(subscriber);
    subscribe(subscriber: TSubscriber): IDisposable;
    unsubscribe(subscriber: TSubscriber): void;
    protected _unsubscribeAll(returnSubscribers?: boolean): TSubscriber[] | null;
    unsubscribeAll(): void;
    protected _onDispose(): void;
}
export default SubscribableBase;
