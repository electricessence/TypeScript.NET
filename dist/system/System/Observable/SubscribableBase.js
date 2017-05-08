/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
System.register(["../Collections/LinkedNodeList", "../Disposable/dispose", "./Subscription", "../Disposable/DisposableBase", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var LinkedNodeList_1, dispose_1, Subscription_1, DisposableBase_1, extends_1, __extends, NAME, SubscribableBase;
    return {
        setters: [
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
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Based upon .NET source.
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
             */
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            NAME = "SubscribableBase";
            // This class is very much akin to a registry or 'Set' but uses an intermediary (Subscription) for releasing the registration.
            SubscribableBase = (function (_super) {
                __extends(SubscribableBase, _super);
                function SubscribableBase() {
                    var _this = _super.call(this) || this;
                    _this._disposableObjectName = NAME;
                    return _this;
                }
                SubscribableBase.prototype._getSubscribers = function () {
                    var s = this.__subscriptions;
                    return s
                        ? s.map(function (node) { return (node && node.value && node.value.subscriber); })
                        : null;
                };
                SubscribableBase.prototype._findEntryNode = function (subscriber) {
                    var s = this.__subscriptions;
                    return s && s.find(function (n) { return !!n.value && n.value.subscriber === subscriber; });
                };
                // It is possible that the same observer could call subscribe more than once and therefore we need to retain a single instance of the subscriber.
                SubscribableBase.prototype.subscribe = function (subscriber) {
                    var _ = this;
                    _.throwIfDisposed();
                    var n = _._findEntryNode(subscriber);
                    if (n)
                        return n.value;
                    var _s = _.__subscriptions;
                    if (!_s)
                        _.__subscriptions = _s
                            = new LinkedNodeList_1.LinkedNodeList();
                    var s = new Subscription_1.Subscription(_, subscriber);
                    _s.addNode({ value: s });
                    return s;
                };
                SubscribableBase.prototype.unsubscribe = function (subscriber) {
                    var _ = this;
                    // _.throwIfDisposed(); If it was disposed, then it's still safe to try and unsubscribe.
                    var n = _._findEntryNode(subscriber);
                    if (n) {
                        var s = n.value;
                        _.__subscriptions.removeNode(n);
                        if (s)
                            s.dispose(); // Prevent further usage of a dead subscription.
                    }
                };
                SubscribableBase.prototype._unsubscribeAll = function (returnSubscribers) {
                    if (returnSubscribers === void 0) { returnSubscribers = false; }
                    var _ = this;
                    var _s = _.__subscriptions;
                    if (!_s)
                        return null;
                    var s = _s.map(function (n) { return n.value; });
                    var u = returnSubscribers ? s.map(function (o) { return o.subscriber; }) : null;
                    _s.clear(); // Reset...
                    dispose_1.dispose.these.noCopy(s);
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
                    if (s)
                        s.dispose();
                };
                return SubscribableBase;
            }(DisposableBase_1.DisposableBase));
            exports_1("SubscribableBase", SubscribableBase);
            exports_1("default", SubscribableBase);
        }
    };
});
//# sourceMappingURL=SubscribableBase.js.map