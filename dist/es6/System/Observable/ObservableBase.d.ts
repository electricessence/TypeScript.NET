/// <reference path="../../../../source/System/Observable/IObserver.d.ts" />
/// <reference path="../../../../source/System/Observable/IObservable.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
import SubscribableBase from "./SubscribableBase";
declare abstract class ObservableBase<T> extends SubscribableBase<IObserver<T>> implements IObservable<T> {
    protected _onNext(value: T): void;
    protected _onError(error: Error): void;
    protected _onCompleted(): void;
}
export default ObservableBase;
