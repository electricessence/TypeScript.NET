/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ICancellable } from "../Threading/ICancellable";
import { ObservableBase } from "../Observable/ObservableBase";
import { ITimer } from "./ITimer";
/**
 * A timer class that uses an Observable pattern to allow for subscribing to ticks.
 */
export default class Timer extends ObservableBase<number> implements ITimer, ICancellable {
    private _interval;
    private _maxCount;
    private _initialDelay;
    private _cancel;
    private _count;
    constructor(_interval: number, _maxCount?: number, _initialDelay?: number);
    /**
     * Initializes a new timer and starts it.
     * @param millisecondInterval
     * @param maxCount
     * @param initialDelay
     * @returns {Timer}
     */
    static startNew(millisecondInterval: number, maxCount?: number, initialDelay?: number): Timer;
    /**
     * Returns true if the timer is running.
     * @returns {boolean}
     */
    readonly isRunning: boolean;
    /**
     * Returns the number of times the timer has ticked (onNext);
     * @returns {number}
     */
    readonly count: number;
    /**
     * Starts the timer.
     */
    start(): void;
    /**
     * Stops the timer.  Is the same as cancel.
     */
    stop(): void;
    /**
     * Stops the timer and resets the count.
     */
    reset(): void;
    /**
     * Forces the onComplete to propagate and returns the number of times the timer ticked.
     * @returns {number}
     */
    complete(): number;
    /**
     * Cancels the timer and returns true if the timer was running.  Returns false if already cancelled.
     * @returns {boolean}
     */
    cancel(): boolean;
    protected _onDispose(): void;
    private static _onTick;
}
