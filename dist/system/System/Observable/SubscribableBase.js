/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
System.register(["../Collections/LinkedNodeList", "../Disposable/dispose", "./Subscription"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var LinkedNodeList_1, dispose_1, Subscription_1;
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
            }],
        execute: function() {
            SubscribableBase = (function () {
                function SubscribableBase() {
                    this.__subscriptions
                        = new LinkedNodeList_1.LinkedNodeList();
                }
                SubscribableBase.prototype._getSubscribers = function () {
                    return this
                        .__subscriptions
                        .map(function (node) { return node.value && node.value.subscriber; });
                };
                SubscribableBase.prototype._findEntryNode = function (subscriber) {
                    return this
                        .__subscriptions
                        .find(function (n) { return n.value.subscriber === subscriber; });
                };
                SubscribableBase.prototype.subscribe = function (subscriber) {
                    var _ = this;
                    var n = _._findEntryNode(subscriber);
                    if (n)
                        return n.value;
                    var s = new Subscription_1.Subscription(_, subscriber);
                    _.__subscriptions.addNode({ value: s });
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
                    var s = _s.map(function (n) { return n.value; });
                    var u = returnSubscribers ? s.map(function (o) { return o.subscriber; }) : null;
                    _s.clear();
                    dispose_1.dispose.these(s);
                    return u;
                };
                SubscribableBase.prototype.unsubscribeAll = function () {
                    this._unsubscribeAll();
                };
                SubscribableBase.prototype.dispose = function () {
                    this._unsubscribeAll();
                };
                return SubscribableBase;
            }());
            exports_1("SubscribableBase", SubscribableBase);
            exports_1("default",SubscribableBase);
        }
    }
});
//# sourceMappingURL=SubscribableBase.js.map