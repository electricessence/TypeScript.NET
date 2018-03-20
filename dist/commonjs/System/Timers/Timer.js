"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ObservableBase_1 = require("../Observable/ObservableBase");
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
/**
 * A timer class that uses an Observable pattern to allow for subscribing to ticks.
 */
var Timer = /** @class */ (function (_super) {
    __extends(Timer, _super);
    function Timer(_interval, _maxCount, _initialDelay) {
        if (_maxCount === void 0) { _maxCount = Infinity; }
        if (_initialDelay === void 0) { _initialDelay = _interval; }
        var _this = _super.call(this) || this;
        _this._interval = _interval;
        _this._maxCount = _maxCount;
        _this._initialDelay = _initialDelay;
        _this._count = 0;
        if (_interval === null)
            throw "'interval' must be a valid number.";
        if (_interval < 0)
            throw "'interval' cannot be negative.";
        return _this;
    }
    /**
     * Initializes a new timer and starts it.
     * @param millisecondInterval
     * @param maxCount
     * @param initialDelay
     * @returns {Timer}
     */
    Timer.startNew = function (millisecondInterval, maxCount, initialDelay) {
        if (maxCount === void 0) { maxCount = Infinity; }
        if (initialDelay === void 0) { initialDelay = millisecondInterval; }
        var t = new Timer(millisecondInterval, maxCount, initialDelay);
        t.start();
        return t;
    };
    Object.defineProperty(Timer.prototype, "isRunning", {
        /**
         * Returns true if the timer is running.
         * @returns {boolean}
         */
        get: function () {
            return !!this._cancel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "count", {
        /**
         * Returns the number of times the timer has ticked (onNext);
         * @returns {number}
         */
        get: function () {
            return this._count;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Starts the timer.
     */
    Timer.prototype.start = function () {
        var _ = this;
        _.throwIfDisposed("This timer has been disposed and can't be reused.");
        if (!_._cancel && _._count < _._maxCount) {
            // For now, if it's isn't the start...
            if (_._count || _._initialDelay === _._interval) {
                var i_1 = setInterval(Timer._onTick, _._interval, _);
                _._cancel = function () {
                    clearInterval(i_1);
                };
            }
            else {
                var i_2 = setTimeout(Timer._onTick, _._initialDelay, _, true);
                _._cancel = function () {
                    clearTimeout(i_2);
                };
            }
        }
    };
    /**
     * Stops the timer.  Is the same as cancel.
     */
    Timer.prototype.stop = function () {
        this.cancel();
    };
    /**
     * Stops the timer and resets the count.
     */
    Timer.prototype.reset = function () {
        this.stop();
        this._count = 0;
    };
    /**
     * Forces the onComplete to propagate and returns the number of times the timer ticked.
     * @returns {number}
     */
    Timer.prototype.complete = function () {
        this.cancel();
        this._onCompleted();
        return this._count;
    };
    /**
     * Cancels the timer and returns true if the timer was running.  Returns false if already cancelled.
     * @returns {boolean}
     */
    Timer.prototype.cancel = function () {
        if (this._cancel) {
            this._cancel();
            this._cancel = undefined;
            return true;
        }
        return false;
    };
    Timer.prototype._onDispose = function () {
        this.cancel();
        _super.prototype._onDispose.call(this);
    };
    // We use a private static here so there's no need to create a handler every time.
    Timer._onTick = function (timer, reInitTimer) {
        var index = timer._count++, max = timer._maxCount, isComplete = timer._count >= max;
        if (reInitTimer) {
            timer.cancel();
            timer.start();
        }
        if (isComplete) {
            timer.stop();
        }
        if (index < max) {
            timer._onNext(index);
        }
        if (isComplete) {
            timer._onCompleted();
        }
    };
    return Timer;
}(ObservableBase_1.ObservableBase));
exports.default = Timer;
//# sourceMappingURL=Timer.js.map