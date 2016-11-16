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
        const subscriber = this.subscriber;
        const subscribable = this._subscribable;
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