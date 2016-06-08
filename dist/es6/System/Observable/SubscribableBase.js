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
export class SubscribableBase extends DisposableBase {
    constructor() {
        super();
    }
    _getSubscribers() {
        var s = this.__subscriptions;
        return s && s.map(node => node.value && node.value.subscriber);
    }
    _findEntryNode(subscriber) {
        var s = this.__subscriptions;
        return s && s.find(n => n.value.subscriber === subscriber);
    }
    subscribe(subscriber) {
        const _ = this;
        _.throwIfDisposed();
        var n = _._findEntryNode(subscriber);
        if (n)
            return n.value;
        var _s = _.__subscriptions;
        if (!_s)
            _.__subscriptions = _s = new LinkedNodeList();
        var s = new Subscription(_, subscriber);
        _s.addNode({ value: s });
        return s;
    }
    unsubscribe(subscriber) {
        const _ = this;
        var n = _._findEntryNode(subscriber);
        if (n) {
            var s = n.value;
            _.__subscriptions.removeNode(n);
            s.dispose();
        }
    }
    _unsubscribeAll(returnSubscribers = false) {
        var _ = this, _s = _.__subscriptions;
        if (!_s)
            return null;
        var s = _s.map(n => n.value);
        var u = returnSubscribers ? s.map(o => o.subscriber) : null;
        _s.clear();
        dispose.these(s);
        return u;
    }
    unsubscribeAll() {
        this._unsubscribeAll();
    }
    _onDispose() {
        super._onDispose();
        this._unsubscribeAll();
        var s = this.__subscriptions;
        this.__subscriptions = null;
        dispose(s);
    }
}
export default SubscribableBase;
//# sourceMappingURL=SubscribableBase.js.map