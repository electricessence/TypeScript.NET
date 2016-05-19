/*!
 * @author electricessence / https://github.com/electricessence/
 * Based on Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IDisposable } from "../Disposable/IDisposable";
export default class EventSimple<T extends Function> implements IDisposable {
    private _listeners;
    add(listener: T): void;
    remove(listener: T): void;
    dispatch(...params: any[]): void;
    toMulticastFunction(): Function;
    dispose(): void;
}
