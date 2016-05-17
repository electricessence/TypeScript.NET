/// <reference path="../../../../source/System/Timers/ITimer.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import TimeSpan from "../Time/TimeSpan";
export default class Stopwatch implements ITimer {
    static getTimestampMilliseconds(): number;
    private _elapsed;
    private _startTimeStamp;
    private _isRunning;
    isRunning: boolean;
    constructor();
    static startNew(): Stopwatch;
    static measure(closure: () => void): TimeSpan;
    start(): void;
    stop(): void;
    reset(): void;
    lap(): TimeSpan;
    currentLapMilliseconds: number;
    currentLap: TimeSpan;
    elapsedMilliseconds: number;
    elapsed: TimeSpan;
}
