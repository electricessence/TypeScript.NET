/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Collections/LinkedNodeList", "../Disposable/dispose", "./Subscription"], factory);
    }
})(function (require, exports) {
    "use strict";
    var LinkedNodeList_1 = require("../Collections/LinkedNodeList");
    var dispose_1 = require("../Disposable/dispose");
    var Subscription_1 = require("./Subscription");
    var SubscribableBase = (function () {
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
    exports.SubscribableBase = SubscribableBase;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SubscribableBase;
});
//# sourceMappingURL=SubscribableBase.js.map