"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A registration that an IObservable returns that can be disposed in order to cancel sending data to the observer.
 */
var Subscription = /** @class */ (function () {
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
        /*
         In the case where we could possibly have the following happen:
         var u = observable.subscribe(observer);
         ...
         u.dispose(); // Should only be allowed to unsubscribe once and then it's useless.
         // Resubscribing creates a new instance.
         var x = observable.subscribe(observer);
         u.dispose(); // Calling this again should do nothing and 'x' should still work.
         */
        get: function () {
            return !this._subscribable || !this._subscriber;
        },
        enumerable: true,
        configurable: true
    });
    Subscription.prototype.dispose = function () {
        var subscriber = this.subscriber;
        var subscribable = this._subscribable;
        // Release this reference.  It will prevent potential unwanted recursion.
        this._subscribable = null;
        try {
            if (subscriber && subscribable) {
                subscribable.unsubscribe(subscriber);
            }
        }
        finally {
            // Keep this reference until the end so it can be identified by the list.
            this._subscriber = null;
        }
    };
    return Subscription;
}());
exports.Subscription = Subscription;
exports.default = Subscription;
//# sourceMappingURL=Subscription.js.map