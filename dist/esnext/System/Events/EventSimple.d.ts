/*!
 * @author electricessence / https://github.com/electricessence/
 * Based on Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IDisposable } from "../Disposable/IDisposable";
/**
 * A simple event dispatcher provided as an alternative to built-in event.
 * If just dispatching a payload to a uniform set of functions, it may be better to just use the utilities in System/Collections/Array/Dispatch.
 */
export default class EventSimple<T extends Function> implements IDisposable {
    private readonly _listeners;
    add(listener: T): void;
    remove(listener: T): void;
    dispatch(...params: any[]): void;
    toMulticastFunction(): Function;
    dispose(): void;
}
