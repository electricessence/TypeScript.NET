/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _CollectionsLinkedList = require('../Collections/LinkedList');

var _CollectionsLinkedList2 = _interopRequireDefault(_CollectionsLinkedList);

var _DisposableUtility = require('../Disposable/Utility');

var DisposeUtility = _interopRequireWildcard(_DisposableUtility);

var _Subscription = require('./Subscription');

var _Subscription2 = _interopRequireDefault(_Subscription);

var SubscribableBase = (function () {
    function SubscribableBase() {
        _classCallCheck(this, SubscribableBase);

        this.__subscriptions = new _CollectionsLinkedList2['default']();
    }

    _createClass(SubscribableBase, [{
        key: '_getSubscribers',
        value: function _getSubscribers() {
            return this.__subscriptions.toArray().map(function (s) {
                return s.subscriber;
            });
        }
    }, {
        key: '_findEntryNode',
        value: function _findEntryNode(subscriber) {
            var node = this.__subscriptions.first;
            while (node) {
                if (node.value.subscriber === subscriber) {
                    break;
                } else {
                    node = node.next;
                }
            }
            return node;
        }
    }, {
        key: 'subscribe',
        value: function subscribe(subscriber) {
            var _ = this;
            var n = _._findEntryNode(subscriber);
            if (n) return n.value;
            var s = new _Subscription2['default'](_, subscriber);
            _.__subscriptions.add(s);
            return s;
        }
    }, {
        key: 'unsubscribe',
        value: function unsubscribe(subscriber) {
            var n = this._findEntryNode(subscriber);
            if (n) {
                var s = n.value;
                n.remove();
                s.dispose();
            }
        }
    }, {
        key: '_unsubscribeAll',
        value: function _unsubscribeAll() {
            var returnSubscribers = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            var _ = this,
                _s = _.__subscriptions;
            var s = _s.toArray();
            var u = returnSubscribers ? s.map(function (o) {
                return o.subscriber;
            }) : null;
            _s.clear();
            DisposeUtility.disposeThese(s);
            return u;
        }
    }, {
        key: 'unsubscribeAll',
        value: function unsubscribeAll() {
            this._unsubscribeAll();
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this._unsubscribeAll();
        }
    }]);

    return SubscribableBase;
})();

exports['default'] = SubscribableBase;
module.exports = exports['default'];
//# sourceMappingURL=SubscribableBase.js.map
