/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
System.register(['../Collections/LinkedList', '../Disposable/Utility', './Subscription'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var LinkedList_1, DisposeUtility, Subscription_1;
    var SubscribableBase;
    return {
        setters:[
            function (LinkedList_1_1) {
                LinkedList_1 = LinkedList_1_1;
            },
            function (DisposeUtility_1) {
                DisposeUtility = DisposeUtility_1;
            },
            function (Subscription_1_1) {
                Subscription_1 = Subscription_1_1;
            }],
        execute: function() {
            SubscribableBase = (function () {
                function SubscribableBase() {
                    this.__subscriptions = new LinkedList_1.default();
                }
                SubscribableBase.prototype._getSubscribers = function () {
                    return this.__subscriptions
                        .toArray()
                        .map(function (s) { return s.subscriber; });
                };
                SubscribableBase.prototype._findEntryNode = function (subscriber) {
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
                };
                SubscribableBase.prototype.subscribe = function (subscriber) {
                    var _ = this;
                    var n = _._findEntryNode(subscriber);
                    if (n)
                        return n.value;
                    var s = new Subscription_1.default(_, subscriber);
                    _.__subscriptions.add(s);
                    return s;
                };
                SubscribableBase.prototype.unsubscribe = function (subscriber) {
                    var n = this._findEntryNode(subscriber);
                    if (n) {
                        var s = n.value;
                        n.remove();
                        s.dispose();
                    }
                };
                SubscribableBase.prototype._unsubscribeAll = function (returnSubscribers) {
                    if (returnSubscribers === void 0) { returnSubscribers = false; }
                    var _ = this, _s = _.__subscriptions;
                    var s = _s.toArray();
                    var u = returnSubscribers ? s.map(function (o) { return o.subscriber; }) : null;
                    _s.clear();
                    DisposeUtility.disposeThese(s);
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
            exports_1("default", SubscribableBase);
        }
    }
});
//# sourceMappingURL=SubscribableBase.js.map