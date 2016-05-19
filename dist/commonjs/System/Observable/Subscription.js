/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Subscription = function () {
    function Subscription(_subscribable, _subscriber) {
        _classCallCheck(this, Subscription);

        this._subscribable = _subscribable;
        this._subscriber = _subscriber;
        if (!_subscribable || !_subscriber) throw 'Subscribable and subscriber cannot be null.';
    }

    _createClass(Subscription, [{
        key: "dispose",
        value: function dispose() {
            var subscriber = this.subscriber;
            var subscribable = this._subscribable;
            this._subscriber = null;
            this._subscribable = null;
            if (subscriber && subscribable) {
                subscribable.unsubscribe(subscriber);
            }
        }
    }, {
        key: "subscriber",
        get: function get() {
            return this._subscriber;
        }
    }, {
        key: "wasDisposed",
        get: function get() {
            return !this._subscribable || !this._subscriber;
        }
    }]);

    return Subscription;
}();

exports.Subscription = Subscription;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Subscription;
//# sourceMappingURL=Subscription.js.map
