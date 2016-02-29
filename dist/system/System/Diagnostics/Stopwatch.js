System.register(['../Time/TimeSpan'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var TimeSpan_1;
    var Stopwatch;
    return {
        setters:[
            function (TimeSpan_1_1) {
                TimeSpan_1 = TimeSpan_1_1;
            }],
        execute: function() {
            Stopwatch = (function () {
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
                    return new TimeSpan_1.default(Stopwatch.getTimestampMilliseconds() - start);
                };
                Stopwatch.prototype.record = function (closure) {
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
                Stopwatch.prototype.lap = function () {
                    var _ = this;
                    if (_._isRunning) {
                        var t = Stopwatch.getTimestampMilliseconds();
                        var s = _._startTimeStamp;
                        var e = t - s;
                        _._startTimeStamp = t;
                        _._elapsed += e;
                        return new TimeSpan_1.default(e);
                    }
                    else
                        return TimeSpan_1.default.zero;
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
                            ? new TimeSpan_1.default(this.currentLapMilliseconds)
                            : TimeSpan_1.default.zero;
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
                        return new TimeSpan_1.default(this.elapsedMilliseconds);
                    },
                    enumerable: true,
                    configurable: true
                });
                return Stopwatch;
            }());
            exports_1("default", Stopwatch);
        }
    }
});
//# sourceMappingURL=Stopwatch.js.map