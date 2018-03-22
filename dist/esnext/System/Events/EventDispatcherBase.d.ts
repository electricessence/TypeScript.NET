/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "../Disposable/DisposableBase";
import { IEventListener } from "./IEventListener";
import { EventDispatcherEntry } from "./EventDispatcherEntry";
import { IEventDispatcher } from "./IEventDispatcher";
export interface IEventBase<TTarget> {
    type: string;
    target: TTarget;
}
export interface IEvent extends IEventBase<any> {
}
export interface IEntryParams {
    priority: number;
    dispatcher: EventDispatcherBase;
}
export default class EventDispatcherBase extends DisposableBase implements IEventDispatcher {
    constructor();
    protected _entries: EventDispatcherEntry<IEntryParams>[] | undefined;
    addEventListener(type: string, listener: IEventListener, priority?: number): void;
    removeEntry(entry: EventDispatcherEntry<IEntryParams>): boolean;
    registerEventListener(type: string, listener: IEventListener, priority?: number): void;
    hasEventListener(type: string, listener?: IEventListener): boolean;
    removeEventListener(type: string, listener: IEventListener): void;
    dispatchEvent(type: string, params?: any): boolean;
    dispatchEvent(event: IEvent): boolean;
    static readonly DISPOSING: string;
    static readonly DISPOSED: string;
    private _isDisposing;
    readonly isDisposing: boolean;
    dispose(): void;
}
