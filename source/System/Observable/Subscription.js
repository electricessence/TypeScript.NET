(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports"], function (require, exports) {
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
            this._subscribable = null;
            try {
                if (subscriber && subscribable) {
                    subscribable.unsubscribe(subscriber);
                }
            }
            finally {
                this._subscriber = null;
            }
        };
        return Subscription;
    }());
    exports.Subscription = Subscription;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Subscription;
});
//# sourceMappingURL=Subscription.js.map