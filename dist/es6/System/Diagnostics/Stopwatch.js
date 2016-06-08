/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TimeSpan } from "../Time/TimeSpan";
function getTimestampMilliseconds() {
    return (new Date()).getTime();
}
export default class Stopwatch {
    constructor() {
        this.reset();
    }
    static getTimestampMilliseconds() {
        return getTimestampMilliseconds();
    }
    get isRunning() {
        return this._isRunning;
    }
    static startNew() {
        var s = new Stopwatch();
        s.start();
        return s;
    }
    static measure(closure) {
        var start = getTimestampMilliseconds();
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
    lap() {
        const _ = this;
        if (_._isRunning) {
            var t = getTimestampMilliseconds();
            var s = _._startTimeStamp;
            var e = t - s;
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
        var timeElapsed = _._elapsed;
        if (_._isRunning)
            timeElapsed += _.currentLapMilliseconds;
        return timeElapsed;
    }
    get elapsed() {
        return new TimeSpan(this.elapsedMilliseconds);
    }
}
//# sourceMappingURL=Stopwatch.js.map