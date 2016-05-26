/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
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
    isRunning: boolean;
    count: number;
    start(): void;
    stop(): void;
    reset(): void;
    cancel(): boolean;
    dispose(): void;
    private static _onTick(timer, reInitTimer?);
}
