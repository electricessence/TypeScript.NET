/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Compare = require('../Compare');

var _TimeUnit = require('./TimeUnit');

var _TimeUnit2 = _interopRequireDefault(_TimeUnit);

var TimeQuantity = (function () {
    function TimeQuantity() {
        var _quantity = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

        _classCallCheck(this, TimeQuantity);

        this._quantity = _quantity;
    }

    _createClass(TimeQuantity, [{
        key: 'getTotalMilliseconds',
        value: function getTotalMilliseconds() {
            return this._quantity;
        }
    }, {
        key: 'equals',
        value: function equals(other) {
            return (0, _Compare.areEqual)(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
        }
    }, {
        key: 'compareTo',
        value: function compareTo(other) {
            return (0, _Compare.compare)(this.getTotalMilliseconds(), other && other.total && other.total.milliseconds);
        }
    }, {
        key: 'getTotal',
        value: function getTotal(units) {
            return _TimeUnit2['default'].fromMilliseconds(this.getTotalMilliseconds(), units);
        }
    }, {
        key: 'direction',
        get: function get() {
            return (0, _Compare.compare)(this.getTotalMilliseconds(), 0);
        }
    }, {
        key: 'total',
        get: function get() {
            var t = this._total;
            if (!t) {
                var ms = this.getTotalMilliseconds();
                this._total = t = Object.freeze({
                    ticks: ms * 10000,
                    milliseconds: ms,
                    seconds: ms / 1000,
                    minutes: ms / 60000,
                    hours: ms / 3600000,
                    days: ms / 86400000
                });
            }
            return t;
        }
    }]);

    return TimeQuantity;
})();

exports['default'] = TimeQuantity;
module.exports = exports['default'];
//# sourceMappingURL=TimeQuantity.js.map
