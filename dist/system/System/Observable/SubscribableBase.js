/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
System.register(["../Collections/LinkedNodeList", "../Disposable/dispose", "./Subscription", "../Disposable/DisposableBase"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var LinkedNodeList_1, dispose_1, Subscription_1, DisposableBase_1;
    var SubscribableBase;
    return {
        setters:[
            function (LinkedNodeList_1_1) {
                LinkedNodeList_1 = LinkedNodeList_1_1;
            },
            function (dispose_1_1) {
                dispose_1 = dispose_1_1;
            },
            function (Subscription_1_1) {
                Subscription_1 = Subscription_1_1;
            },
            function (DisposableBase_1_1) {
                DisposableBase_1 = DisposableBase_1_1;
            }],
        execute: function() {
            SubscribableBase = (function (_super) {
                __extends(SubscribableBase, _super);
                function SubscribableBase() {
                    _super.call(this);
                }
                SubscribableBase.prototype._getSubscribers = function () {
                    var s = this.__subscriptions;
                    return s && s.map(function (node) { return node.value && node.value.subscriber; });
                };
                SubscribableBase.prototype._findEntryNode = function (subscriber) {
                    var s = this.__subscriptions;
                    return s && s.find(function (n) { return n.value.subscriber === subscriber; });
                };
                SubscribableBase.prototype.subscribe = function (subscriber) {
                    var _ = this;
                    _.throwIfDisposed();
                    var n = _._findEntryNode(subscriber);
                    if (n)
                        return n.value;
                    var _s = _.__subscriptions;
                    if (!_s)
                        _.__subscriptions = _s = new LinkedNodeList_1.LinkedNodeList();
                    var s = new Subscription_1.Subscription(_, subscriber);
                    _s.addNode({ value: s });
                    return s;
                };
                SubscribableBase.prototype.unsubscribe = function (subscriber) {
                    var _ = this;
                    var n = _._findEntryNode(subscriber);
                    if (n) {
                        var s = n.value;
                        _.__subscriptions.removeNode(n);
                        s.dispose();
                    }
                };
                SubscribableBase.prototype._unsubscribeAll = function (returnSubscribers) {
                    if (returnSubscribers === void 0) { returnSubscribers = false; }
                    var _ = this, _s = _.__subscriptions;
                    if (!_s)
                        return null;
                    var s = _s.map(function (n) { return n.value; });
                    var u = returnSubscribers ? s.map(function (o) { return o.subscriber; }) : null;
                    _s.clear();
                    dispose_1.dispose.these(s);
                    return u;
                };
                SubscribableBase.prototype.unsubscribeAll = function () {
                    this._unsubscribeAll();
                };
                SubscribableBase.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    this._unsubscribeAll();
                    var s = this.__subscriptions;
                    this.__subscriptions = null;
                    dispose_1.dispose(s);
                };
                return SubscribableBase;
            }(DisposableBase_1.DisposableBase));
            exports_1("SubscribableBase", SubscribableBase);
            exports_1("default",SubscribableBase);
        }
    }
});
//# sourceMappingURL=SubscribableBase.js.map