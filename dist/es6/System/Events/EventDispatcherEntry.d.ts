/// <reference path="../../../../source/System/IEquatable.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import DisposableBase from "../Disposable/DisposableBase";
export default class EventDispatcherEntry<TParams> extends DisposableBase implements IEquatable<EventDispatcherEntry<TParams>> {
    type: string;
    listener: IEventListener;
    params: TParams;
    constructor(type: string, listener: IEventListener, params?: TParams, finalizer?: () => void);
    protected _onDispose(): void;
    dispatch(e: Event): boolean;
    matches(type: string, listener: IEventListener): boolean;
    equals(other: EventDispatcherEntry<TParams>): boolean;
}
