/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
import ObservableBase from "./ObservableBase";
import { IObserver } from "./IObserver";
export declare class ObservableNodeBase<T> extends ObservableBase<T> implements IObserver<T> {
    onNext(value: T): void;
    onError(error: any): void;
    onCompleted(): void;
}
export default ObservableNodeBase;
