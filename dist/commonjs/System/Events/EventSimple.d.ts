import { IDisposable } from "../Disposable/IDisposable";
export default class EventSimple<T extends Function> implements IDisposable {
    private _listeners;
    add(listener: T): void;
    remove(listener: T): void;
    dispatch(...params: any[]): void;
    toMulticastFunction(): Function;
    dispose(): void;
}
