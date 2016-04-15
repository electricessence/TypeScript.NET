/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
'use strict';
import LinkedNodeList from "../Collections/LinkedNodeList";
import * as DisposeUtility from "../Disposable/Utility";
import Subscription from "./Subscription";
export default class SubscribableBase {
    constructor() {
        this.__subscriptions
            = new LinkedNodeList();
    }
    _getSubscribers() {
        return this
            .__subscriptions
            .map(node => node.value && node.value.subscriber);
    }
    _findEntryNode(subscriber) {
        return this
            .__subscriptions
            .find(n => n.value.subscriber === subscriber);
    }
    subscribe(subscriber) {
        var _ = this;
        var n = _._findEntryNode(subscriber);
        if (n)
            return n.value;
        var s = new Subscription(_, subscriber);
        _.__subscriptions.addNode({ value: s });
        return s;
    }
    unsubscribe(subscriber) {
        var _ = this;
        var n = _._findEntryNode(subscriber);
        if (n) {
            var s = n.value;
            _.__subscriptions.removeNode(n);
            s.dispose();
        }
    }
    _unsubscribeAll(returnSubscribers = false) {
        var _ = this, _s = _.__subscriptions;
        var s = _s.map(n => n.value);
        var u = returnSubscribers ? s.map(o => o.subscriber) : null;
        _s.clear();
        DisposeUtility.disposeThese(s);
        return u;
    }
    unsubscribeAll() {
        this._unsubscribeAll();
    }
    dispose() {
        this._unsubscribeAll();
    }
}
//# sourceMappingURL=SubscribableBase.js.map