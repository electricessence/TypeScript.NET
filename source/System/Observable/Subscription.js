/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
'use strict'; // For compatibility with (let, const, function, class);
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    ///<reference path="ISubscribable.d.ts"/>
    ///<reference path="IObservable.d.ts"/>
    ///<reference path="../Disposable/IDisposableAware.d.ts"/>
    /**
     * A registration that an IObservable returns that can be disposed in order to cancel sending data to the observer.
     */
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
            // Release the references.  Will prevent potential unwanted recursion.
            this._subscriber = null;
            this._subscribable = null;
            if (subscriber && subscribable) {
                subscribable.unsubscribe(subscriber);
            }
        };
        return Subscription;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Subscription;
});
//# sourceMappingURL=Subscription.js.map