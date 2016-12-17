/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
import { LinkedNodeList } from "../Collections/LinkedNodeList";
import { dispose } from "../Disposable/dispose";
import { Subscription } from "./Subscription";
import { DisposableBase } from "../Disposable/DisposableBase";
// noinspection JSUnusedLocalSymbols
const NAME = "SubscribableBase";
// This class is very much akin to a registry or 'Set' but uses an intermediary (Subscription) for releasing the registration.
export class SubscribableBase extends DisposableBase {
    constructor() {
        super();
        this._disposableObjectName = NAME;
    }
    _getSubscribers() {
        const s = this.__subscriptions;
        return s
            ? s.map(node => (node && node.value && node.value.subscriber))
            : null;
    }
    _findEntryNode(subscriber) {
        const s = this.__subscriptions;
        return s && s.find(n => !!n.value && n.value.subscriber === subscriber);
    }
    // It is possible that the same observer could call subscribe more than once and therefore we need to retain a single instance of the subscriber.
    subscribe(subscriber) {
        const _ = this;
        _.throwIfDisposed();
        const n = _._findEntryNode(subscriber);
        if (n)
            return n.value;
        let _s = _.__subscriptions;
        if (!_s)
            _.__subscriptions = _s
                = new LinkedNodeList();
        const s = new Subscription(_, subscriber);
        _s.addNode({ value: s });
        return s;
    }
    unsubscribe(subscriber) {
        const _ = this;
        // _.throwIfDisposed(); If it was disposed, then it's still safe to try and unsubscribe.
        const n = _._findEntryNode(subscriber);
        if (n) {
            const s = n.value;
            _.__subscriptions.removeNode(n);
            if (s)
                s.dispose(); // Prevent further usage of a dead subscription.
        }
    }
    _unsubscribeAll(returnSubscribers = false) {
        const _ = this;
        let _s = _.__subscriptions;
        if (!_s)
            return null;
        const s = _s.map(n => n.value);
        const u = returnSubscribers ? s.map(o => o.subscriber) : null;
        _s.clear(); // Reset...
        dispose.these.noCopy(s);
        return u;
    }
    unsubscribeAll() {
        this._unsubscribeAll();
    }
    _onDispose() {
        super._onDispose();
        this._unsubscribeAll();
        const s = this.__subscriptions;
        this.__subscriptions = null;
        if (s)
            s.dispose();
    }
}
export default SubscribableBase;
//# sourceMappingURL=SubscribableBase.js.map