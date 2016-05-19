/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinkedNodeList_1 = require("../Collections/LinkedNodeList");
var dispose_1 = require("../Disposable/dispose");
var Subscription_1 = require("./Subscription");

var SubscribableBase = function () {
    function SubscribableBase() {
        _classCallCheck(this, SubscribableBase);

        this.__subscriptions = new LinkedNodeList_1.LinkedNodeList();
    }

    _createClass(SubscribableBase, [{
        key: "_getSubscribers",
        value: function _getSubscribers() {
            return this.__subscriptions.map(function (node) {
                return node.value && node.value.subscriber;
            });
        }
    }, {
        key: "_findEntryNode",
        value: function _findEntryNode(subscriber) {
            return this.__subscriptions.find(function (n) {
                return n.value.subscriber === subscriber;
            });
        }
    }, {
        key: "subscribe",
        value: function subscribe(subscriber) {
            var _ = this;
            var n = _._findEntryNode(subscriber);
            if (n) return n.value;
            var s = new Subscription_1.Subscription(_, subscriber);
            _.__subscriptions.addNode({ value: s });
            return s;
        }
    }, {
        key: "unsubscribe",
        value: function unsubscribe(subscriber) {
            var _ = this;
            var n = _._findEntryNode(subscriber);
            if (n) {
                var s = n.value;
                _.__subscriptions.removeNode(n);
                s.dispose();
            }
        }
    }, {
        key: "_unsubscribeAll",
        value: function _unsubscribeAll() {
            var returnSubscribers = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            var _ = this,
                _s = _.__subscriptions;
            var s = _s.map(function (n) {
                return n.value;
            });
            var u = returnSubscribers ? s.map(function (o) {
                return o.subscriber;
            }) : null;
            _s.clear();
            dispose_1.dispose.these(s);
            return u;
        }
    }, {
        key: "unsubscribeAll",
        value: function unsubscribeAll() {
            this._unsubscribeAll();
        }
    }, {
        key: "dispose",
        value: function dispose() {
            this._unsubscribeAll();
        }
    }]);

    return SubscribableBase;
}();

exports.SubscribableBase = SubscribableBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SubscribableBase;
//# sourceMappingURL=SubscribableBase.js.map
