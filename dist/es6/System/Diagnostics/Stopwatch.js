/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TimeSpan } from "../Time/TimeSpan";
function getTimestampMilliseconds() {
    return (new Date()).getTime();
}
export default class Stopwatch {
    static getTimestampMilliseconds() {
        return getTimestampMilliseconds();
    }
    get isRunning() {
        return this._isRunning;
    }
    constructor() {
        this.reset();
    }
    static startNew() {
        const s = new Stopwatch();
        s.start();
        return s;
    }
    static measure(closure) {
        const start = getTimestampMilliseconds();
        closure();
        return new TimeSpan(getTimestampMilliseconds() - start);
    }
    start() {
        const _ = this;
        if (!_._isRunning) {
            _._startTimeStamp = getTimestampMilliseconds();
            _._isRunning = true;
        }
    }
    stop() {
        const _ = this;
        if (_._isRunning) {
            _._elapsed += _.currentLapMilliseconds;
            _._isRunning = false;
        }
    }
    reset() {
        const _ = this;
        _._elapsed = 0;
        _._isRunning = false;
        _._startTimeStamp = NaN;
    }
    // Effectively calls a stop start and continues timing...
    // Can also be called to effectively start a lap before calling it again to get the elapsed lap time.
    lap() {
        const _ = this;
        if (_._isRunning) {
            const t = getTimestampMilliseconds();
            const s = _._startTimeStamp;
            const e = t - s;
            _._startTimeStamp = t;
            _._elapsed += e;
            return new TimeSpan(e);
        }
        else
            return TimeSpan.zero;
    }
    get currentLapMilliseconds() {
        return this._isRunning
            ? (getTimestampMilliseconds() - this._startTimeStamp)
            : 0;
    }
    get currentLap() {
        return this._isRunning
            ? new TimeSpan(this.currentLapMilliseconds)
            : TimeSpan.zero;
    }
    get elapsedMilliseconds() {
        const _ = this;
        let timeElapsed = _._elapsed;
        if (_._isRunning)
            timeElapsed += _.currentLapMilliseconds;
        return timeElapsed;
    }
    get elapsed() {
        return new TimeSpan(this.elapsedMilliseconds);
    }
}
//# sourceMappingURL=Stopwatch.js.map