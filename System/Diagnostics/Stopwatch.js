/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports", '../Time/TimeSpan'], function (require, exports, TimeSpan) {
    var Stopwatch = (function () {
        function Stopwatch() {
            this.reset();
        }
        Stopwatch.getTimestampMilliseconds = function () {
            return (new Date()).getTime();
        };
        Object.defineProperty(Stopwatch.prototype, "isRunning", {
            get: function () {
                return this._isRunning;
            },
            enumerable: true,
            configurable: true
        });
        Stopwatch.startNew = function () {
            var s = new Stopwatch();
            s.start();
            return s;
        };
        Stopwatch.measure = function (closure) {
            var start = Stopwatch.getTimestampMilliseconds();
            closure();
            return new TimeSpan(Stopwatch.getTimestampMilliseconds() - start);
        };
        Stopwatch.prototype.record = function (closure) {
            // Although a reasonably thread safe way to record, it may not correctly represent time in an async scenario.
            var e = Stopwatch.measure(closure);
            this._elapsed += e.milliseconds;
            return e;
        };
        Stopwatch.prototype.start = function () {
            var _ = this;
            if (!_._isRunning) {
                _._startTimeStamp = Stopwatch.getTimestampMilliseconds();
                _._isRunning = true;
            }
        };
        Stopwatch.prototype.stop = function () {
            var _ = this;
            if (_._isRunning) {
                _._elapsed += _.currentLapMilliseconds;
                _._isRunning = false;
            }
        };
        Stopwatch.prototype.reset = function () {
            var _ = this;
            _._elapsed = 0;
            _._isRunning = false;
            _._startTimeStamp = NaN;
        };
        // Effectively calls a stop start and continues timing...
        // Can also be called to effectively start a lap before calling it again to get the elapsed lap time.
        Stopwatch.prototype.lap = function () {
            var _ = this;
            if (_._isRunning) {
                var t = Stopwatch.getTimestampMilliseconds();
                var s = _._startTimeStamp;
                var e = t - s;
                _._startTimeStamp = t;
                _._elapsed += e;
                return new TimeSpan(e);
            }
            else
                return TimeSpan.zero;
        };
        Object.defineProperty(Stopwatch.prototype, "currentLapMilliseconds", {
            get: function () {
                return this._isRunning
                    ? (Stopwatch.getTimestampMilliseconds() - this._startTimeStamp)
                    : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stopwatch.prototype, "currentLap", {
            get: function () {
                return this._isRunning
                    ? new TimeSpan(this.currentLapMilliseconds)
                    : TimeSpan.zero;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stopwatch.prototype, "elapsedMilliseconds", {
            get: function () {
                var _ = this;
                var timeElapsed = _._elapsed;
                if (_._isRunning)
                    timeElapsed += _.currentLapMilliseconds;
                return timeElapsed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stopwatch.prototype, "elapsed", {
            get: function () {
                return new TimeSpan(this.elapsedMilliseconds);
            },
            enumerable: true,
            configurable: true
        });
        return Stopwatch;
    })();
    return Stopwatch;
});
//# sourceMappingURL=Stopwatch.js.map