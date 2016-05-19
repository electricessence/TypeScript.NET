/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
import { IDisposableAware } from "../Disposable/IDisposableAware";
import { ISubscribable } from "./ISubscribable";
export declare class Subscription<T> implements IDisposableAware {
    private _subscribable;
    private _subscriber;
    constructor(_subscribable: ISubscribable<T>, _subscriber: T);
    subscriber: T;
    wasDisposed: boolean;
    dispose(): void;
}
export default Subscription;
