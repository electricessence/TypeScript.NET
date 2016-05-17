/// <reference path="../../../../source/System/Observable/IObserver.d.ts" />
/// <reference path="../../../../source/System/Observable/IObservable.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
import ObservableBase from "./ObservableBase";
export default class ObservableNodeBase<T> extends ObservableBase<T> implements IObserver<T> {
    onNext(value: T): void;
    onError(error: Error): void;
    onCompleted(): void;
}
