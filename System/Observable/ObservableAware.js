/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
define(["require", "exports"], function (require, exports) {
    ///<reference path="IObserver.ts"/>
    ///<reference path="IObservable.ts"/>
    ///<reference path="../Disposable/IDisposableAware.ts"/>
    var Subscription = (function () {
        function Subscription(_observable, observer) {
            this._observable = _observable;
            this.observer = observer;
            if (!_observable || !observer)
                throw 'Observable and observer cannot be null.';
        }
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
                return !this._observable || !this.observer;
            },
            enumerable: true,
            configurable: true
        });
        Subscription.prototype.dispose = function () {
            var observer = this.observer;
            var observable = this._observable;
            if (observer && observable) {
                // Release the references.  Will prevent potential unwanted recursion.
                this.observer = null;
                this._observable = null;
                observable.unsubscribe(observer);
            }
        };
        return Subscription;
    })();
    // Can be used as a base class, mixin, or simply reference on how to implement the pattern.
    var ObservableNode = (function () {
        function ObservableNode() {
            this._subscribers = new LinkedList();
        }
        ObservableNode.prototype._findEntryNode = function (observer) {
            var node = this._subscribers.first;
            while (node) {
                if (node.value.observer == observer) {
                    break;
                }
                else {
                    node = node.next;
                }
            }
            return node;
        };
        // It is possible that the same observer could call subscribe more than once and therefore we need to retain a single instance of the subscriber.
        ObservableNode.prototype.subscribe = function (observer) {
            var n = this._findEntryNode(observer);
            if (n)
                return n.value;
            var s = new Subscription(this, observer);
            this._subscribers.add(s);
            return s;
        };
        ObservableNode.prototype.unsubscribe = function (observer) {
            var n = this._findEntryNode(observer);
            if (n) {
                var s = n.value;
                n.remove();
                s.dispose(); // Prevent further usage of a dead subscription.
            }
        };
        ObservableNode.prototype.onNext = function (value) {
            // Use a clone in case calling "onNext" will cause a change in the collection contents.
            this._subscribers
                .forEachFromClone(function (s) { return s.observer.onNext(value); });
        };
        ObservableNode.prototype.onError = function (error) {
            // Use a clone in case calling "onError" will cause a change in the collection contents.
            this._subscribers
                .forEachFromClone(function (s) { return s.observer.onError(error); });
        };
        ObservableNode.prototype.onCompleted = function () {
            var array = this._subscribers.toArray();
            this._subscribers.clear();
            array.forEach(function (entry) {
                var observer = entry.observer;
                entry.dispose();
                observer.onCompleted();
            });
            array.length = 0;
        };
        return ObservableNode;
    })();
    return ObservableNode;
});
//# sourceMappingURL=ObservableAware.js.map