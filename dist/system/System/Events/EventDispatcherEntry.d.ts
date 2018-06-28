/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "../Disposable/DisposableBase";
import { IEventListener } from "./IEventListener";
import { IEquatable } from "../IEquatable";
import { Closure } from "../FunctionTypes";
export declare class EventDispatcherEntry<TParams> extends DisposableBase implements IEquatable<EventDispatcherEntry<TParams>> {
    type: string;
    listener: IEventListener;
    params?: TParams | undefined;
    constructor(type: string, listener: IEventListener, params?: TParams | undefined, finalizer?: Closure);
    protected _onDispose(): void;
    /**
     * Safely dispatches an event if entry is not disposed and type matches.
     * @param e
     * @returns {IEventListener|boolean}
     */
    dispatch(e: Event): boolean;
    /**
     * Compares type and listener object only.
     * @param type
     * @param listener
     * @returns {boolean}
     */
    matches(type: string, listener: IEventListener): boolean;
    /**
     * Compares type, listener, and priority.
     * @param other
     * @returns {boolean}
     */
    equals(other: EventDispatcherEntry<TParams>): boolean;
}
export default EventDispatcherEntry;
