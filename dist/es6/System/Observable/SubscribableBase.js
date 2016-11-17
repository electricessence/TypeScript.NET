import { LinkedNodeList } from "../Collections/LinkedNodeList";
import { dispose } from "../Disposable/dispose";
import { Subscription } from "./Subscription";
import { DisposableBase } from "../Disposable/DisposableBase";
const NAME = "SubscribableBase";
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
        const n = _._findEntryNode(subscriber);
        if (n) {
            const s = n.value;
            _.__subscriptions.removeNode(n);
            if (s)
                s.dispose();
        }
    }
    _unsubscribeAll(returnSubscribers = false) {
        const _ = this;
        let _s = _.__subscriptions;
        if (!_s)
            return null;
        const s = _s.map(n => n.value);
        const u = returnSubscribers ? s.map(o => o.subscriber) : null;
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
        const s = this.__subscriptions;
        this.__subscriptions = null;
        dispose(s);
    }
}
export default SubscribableBase;
//# sourceMappingURL=SubscribableBase.js.map