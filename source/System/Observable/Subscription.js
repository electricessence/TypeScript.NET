/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Subscription = (function () {
        function Subscription(_subscribable, _subscriber) {
            this._subscribable = _subscribable;
            this._subscriber = _subscriber;
            if (!_subscribable || !_subscriber)
                throw 'Subscribable and subscriber cannot be null.';
        }
        Object.defineProperty(Subscription.prototype, "subscriber", {
            get: function () {
                return this._subscriber;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Subscription.prototype, "wasDisposed", {
            get: function () {
                return !this._subscribable || !this._subscriber;
            },
            enumerable: true,
            configurable: true
        });
        Subscription.prototype.dispose = function () {
            var subscriber = this.subscriber;
            var subscribable = this._subscribable;
            this._subscriber = null;
            this._subscribable = null;
            if (subscriber && subscribable) {
                subscribable.unsubscribe(subscriber);
            }
        };
        return Subscription;
    }());
    exports.Subscription = Subscription;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Subscription;
});
//# sourceMappingURL=Subscription.js.map