import { ICancellable } from "../Threading/ICancellable";
import { ObservableBase } from "../Observable/ObservableBase";
import { ITimer } from "./ITimer";
export default class Timer extends ObservableBase<number> implements ITimer, ICancellable {
    private _interval;
    private _maxCount;
    private _initialDelay;
    private _cancel;
    private _count;
    constructor(_interval: number, _maxCount?: number, _initialDelay?: number);
    static startNew(millisecondInterval: number, maxCount?: number, initialDelay?: number): Timer;
    readonly isRunning: boolean;
    readonly count: number;
    start(): void;
    stop(): void;
    reset(): void;
    complete(): number;
    cancel(): boolean;
    protected _onDispose(): void;
    private static _onTick(timer, reInitTimer?);
}
