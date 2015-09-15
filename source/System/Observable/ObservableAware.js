/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
define(["require", "exports", '../Collections/LinkedList'], function (require, exports, LinkedList) {
    var Subscription = (function () {
        function Subscription(_observable, observer) {
            this._observable = _observable;
            this.observer = observer;
            if (!_observable || !observer)
                throw 'Observable and observer cannot be null.';
        }
        Object.defineProperty(Subscription.prototype, "wasDisposed", {
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
                this.observer = null;
                this._observable = null;
                observable.unsubscribe(observer);
            }
        };
        return Subscription;
    })();
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
                s.dispose();
            }
        };
        ObservableNode.prototype.onNext = function (value) {
            this._subscribers
                .forEachFromClone(function (s) { return s.observer.onNext(value); });
        };
        ObservableNode.prototype.onError = function (error) {
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