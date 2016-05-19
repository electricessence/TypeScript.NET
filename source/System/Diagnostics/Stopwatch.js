/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Time/TimeSpan"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TimeSpan_1 = require("../Time/TimeSpan");
    function getTimestampMilliseconds() {
        return (new Date()).getTime();
    }
    var Stopwatch = (function () {
        function Stopwatch() {
            this.reset();
        }
        Stopwatch.getTimestampMilliseconds = function () {
            return getTimestampMilliseconds();
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
            var start = getTimestampMilliseconds();
            closure();
            return new TimeSpan_1.TimeSpan(getTimestampMilliseconds() - start);
        };
        Stopwatch.prototype.start = function () {
            var _ = this;
            if (!_._isRunning) {
                _._startTimeStamp = getTimestampMilliseconds();
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
        Stopwatch.prototype.lap = function () {
            var _ = this;
            if (_._isRunning) {
                var t = getTimestampMilliseconds();
                var s = _._startTimeStamp;
                var e = t - s;
                _._startTimeStamp = t;
                _._elapsed += e;
                return new TimeSpan_1.TimeSpan(e);
            }
            else
                return TimeSpan_1.TimeSpan.zero;
        };
        Object.defineProperty(Stopwatch.prototype, "currentLapMilliseconds", {
            get: function () {
                return this._isRunning
                    ? (getTimestampMilliseconds() - this._startTimeStamp)
                    : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stopwatch.prototype, "currentLap", {
            get: function () {
                return this._isRunning
                    ? new TimeSpan_1.TimeSpan(this.currentLapMilliseconds)
                    : TimeSpan_1.TimeSpan.zero;
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
                return new TimeSpan_1.TimeSpan(this.elapsedMilliseconds);
            },
            enumerable: true,
            configurable: true
        });
        return Stopwatch;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Stopwatch;
});
//# sourceMappingURL=Stopwatch.js.map