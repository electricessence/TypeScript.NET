/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimeSpan_1 = require("../Time/TimeSpan");
function _getTimestampMilliseconds() {
    return new Date().getTime();
}

var Stopwatch = function () {
    function Stopwatch() {
        _classCallCheck(this, Stopwatch);

        this.reset();
    }

    _createClass(Stopwatch, [{
        key: "start",
        value: function start() {
            var _ = this;
            if (!_._isRunning) {
                _._startTimeStamp = _getTimestampMilliseconds();
                _._isRunning = true;
            }
        }
    }, {
        key: "stop",
        value: function stop() {
            var _ = this;
            if (_._isRunning) {
                _._elapsed += _.currentLapMilliseconds;
                _._isRunning = false;
            }
        }
    }, {
        key: "reset",
        value: function reset() {
            var _ = this;
            _._elapsed = 0;
            _._isRunning = false;
            _._startTimeStamp = NaN;
        }
    }, {
        key: "lap",
        value: function lap() {
            var _ = this;
            if (_._isRunning) {
                var t = _getTimestampMilliseconds();
                var s = _._startTimeStamp;
                var e = t - s;
                _._startTimeStamp = t;
                _._elapsed += e;
                return new TimeSpan_1.TimeSpan(e);
            } else return TimeSpan_1.TimeSpan.zero;
        }
    }, {
        key: "isRunning",
        get: function get() {
            return this._isRunning;
        }
    }, {
        key: "currentLapMilliseconds",
        get: function get() {
            return this._isRunning ? _getTimestampMilliseconds() - this._startTimeStamp : 0;
        }
    }, {
        key: "currentLap",
        get: function get() {
            return this._isRunning ? new TimeSpan_1.TimeSpan(this.currentLapMilliseconds) : TimeSpan_1.TimeSpan.zero;
        }
    }, {
        key: "elapsedMilliseconds",
        get: function get() {
            var _ = this;
            var timeElapsed = _._elapsed;
            if (_._isRunning) timeElapsed += _.currentLapMilliseconds;
            return timeElapsed;
        }
    }, {
        key: "elapsed",
        get: function get() {
            return new TimeSpan_1.TimeSpan(this.elapsedMilliseconds);
        }
    }], [{
        key: "getTimestampMilliseconds",
        value: function getTimestampMilliseconds() {
            return _getTimestampMilliseconds();
        }
    }, {
        key: "startNew",
        value: function startNew() {
            var s = new Stopwatch();
            s.start();
            return s;
        }
    }, {
        key: "measure",
        value: function measure(closure) {
            var start = _getTimestampMilliseconds();
            closure();
            return new TimeSpan_1.TimeSpan(_getTimestampMilliseconds() - start);
        }
    }]);

    return Stopwatch;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Stopwatch;
//# sourceMappingURL=Stopwatch.js.map
