/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
export class Subscription {
    constructor(_subscribable, _subscriber) {
        this._subscribable = _subscribable;
        this._subscriber = _subscriber;
        if (!_subscribable || !_subscriber)
            throw 'Subscribable and subscriber cannot be null.';
    }
    get subscriber() {
        return this._subscriber;
    }
    get wasDisposed() {
        return !this._subscribable || !this._subscriber;
    }
    dispose() {
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
    }
}
export default Subscription;
//# sourceMappingURL=Subscription.js.map