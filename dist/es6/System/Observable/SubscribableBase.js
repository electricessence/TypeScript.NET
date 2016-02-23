/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
'use strict';
import LinkedList from '../Collections/LinkedList';
import * as DisposeUtility from '../Disposable/Utility';
import Subscription from './Subscription';
export default class SubscribableBase {
    constructor() {
        this.__subscriptions = new LinkedList();
    }
    _getSubscribers() {
        return this.__subscriptions
            .toArray()
            .map(s => s.subscriber);
    }
    _findEntryNode(subscriber) {
        var node = this.__subscriptions.first;
        while (node) {
            if (node.value.subscriber === subscriber) {
                break;
            }
            else {
                node = node.next;
            }
        }
        return node;
    }
    subscribe(subscriber) {
        var _ = this;
        var n = _._findEntryNode(subscriber);
        if (n)
            return n.value;
        var s = new Subscription(_, subscriber);
        _.__subscriptions.add(s);
        return s;
    }
    unsubscribe(subscriber) {
        var n = this._findEntryNode(subscriber);
        if (n) {
            var s = n.value;
            n.remove();
            s.dispose();
        }
    }
    _unsubscribeAll(returnSubscribers = false) {
        var _ = this, _s = _.__subscriptions;
        var s = _s.toArray();
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